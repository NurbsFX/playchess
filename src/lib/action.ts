// app/actions/server.ts
'use server'

import { PrismaClient, GameStatus, InvitationStatus, GameResult, User } from '@prisma/client'
import { auth } from '@/lib/auth'
import { headers } from "next/headers";
import { Chess } from 'chess.js'


const prisma = new PrismaClient()

export async function invitePlayer(receiverId: string) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.email) throw new Error('Non autorisé')

    const sender = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!sender) throw new Error('Utilisateur non trouvé')

    // Vérifie si une invitation PENDING existe déjà
    const existing = await prisma.gameInvitation.findFirst({
        where: {
            senderId: sender.id,
            receiverId,
            status: InvitationStatus.PENDING,
        },
    })

    if (existing) return { alreadyInvited: true }

    // Crée une nouvelle invitation
    await prisma.gameInvitation.create({
        data: {
            senderId: sender.id,
            receiverId,
            status: InvitationStatus.PENDING,
        },
    })

    return { success: true }
}

type UserWithDetails = User & {
    userDetails: { username: string } | null;
    ratingHistories: { rating: number }[];
}

export async function getCurrentUserId() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.email) throw new Error('Non autorisé')

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    })

    if (!user) throw new Error('Utilisateur introuvable')

    return user.id
}

export async function getAllPlayers() {
    const users = await prisma.user.findMany({
        include: {
            userDetails: true,
            ratingHistories: {
                orderBy: { createdAt: 'desc' },
                take: 1,
            },
        },
    }) as UserWithDetails[]

    // Format propre pour usage frontend
    return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        elo: user.ratingHistories[0]?.rating ?? null,
        userDetails: user.userDetails ?? null,
    }))
}

export async function getReceivedInvitations() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.email) throw new Error('Non autorisé')

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user) throw new Error('Utilisateur non trouvé')

    const invitations = await prisma.gameInvitation.findMany({
        where: {
            receiverId: user.id,
            status: InvitationStatus.PENDING,
        },
        include: {
            sender: {
                select: { id: true, name: true, email: true },
            },
        },
    })

    return invitations
}

export async function acceptInvitation(invitationId: string) {
    const invitation = await prisma.gameInvitation.findUnique({
        where: { id: invitationId },
    })

    if (!invitation || invitation.status !== InvitationStatus.PENDING) throw new Error('Invitation invalide')

    const [whiteId, blackId] =
        Math.random() > 0.5
            ? [invitation.senderId, invitation.receiverId]
            : [invitation.receiverId, invitation.senderId]

    await prisma.$transaction([
        prisma.gameInvitation.update({
            where: { id: invitationId },
            data: { status: InvitationStatus.ACCEPTED },
        }),
        prisma.game.create({
            data: {
                playerWhiteId: whiteId,
                playerBlackId: blackId,
                status: GameStatus.ONGOING,
                startedAt: new Date(),
                result: GameResult.UNDECIDED,
            },
        }),
    ])

    return { success: true }
}

export async function declineInvitation(invitationId: string) {
    const invitation = await prisma.gameInvitation.findUnique({
        where: { id: invitationId },
    })

    if (!invitation || invitation.status !== InvitationStatus.PENDING) throw new Error('Invitation invalide')

    await prisma.gameInvitation.update({
        where: { id: invitationId },
        data: { status: InvitationStatus.DECLINED },
    })

    return { success: true }
}

export async function getOngoingGame() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.email) throw new Error('Non autorisé')

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user) throw new Error('Utilisateur introuvable')

    const game = await prisma.game.findFirst({
        where: {
            status: 'ONGOING',
            OR: [
                { playerWhiteId: user.id },
                { playerBlackId: user.id },
            ],
        },
        include: {
            moves: {
                orderBy: { moveNumber: 'asc' },
            },
            playerWhite: true,
            playerBlack: true,
        },
    })

    return game
}

export async function playMove(gameId: string, from: string, to: string) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.email) throw new Error('Non autorisé')

    const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: { moves: true },
    })

    if (!game) throw new Error('Partie non trouvée')

    // Reconstitue la partie
    const chess = new Chess()
    for (const move of game.moves) {
        chess.move(move.notation)
    }

    const moveResult = chess.move({ from, to, promotion: 'q' }) // auto-promotion en reine
    if (!moveResult) throw new Error('Coup invalide')

    await prisma.move.create({
        data: {
            gameId: gameId,
            moveNumber: game.moves.length + 1,
            notation: moveResult.san,
            fen: chess.fen(),
        },
    })

    return { success: true }
}

export async function getUserGames() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) throw new Error('Non autorisé');

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) throw new Error('Utilisateur introuvable');

    const games = await prisma.game.findMany({
        where: {
            OR: [
                { playerWhiteId: user.id },
                { playerBlackId: user.id },
            ],
        },
        include: {
            playerWhite: true,
            playerBlack: true,
            moves: {
                orderBy: { moveNumber: 'asc' },
            },
        },
        orderBy: { updatedAt: 'desc' },
    });

    return games;
}

export async function getAllGamesForCurrentUser() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.email) throw new Error('Non autorisé')

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })
    if (!user) throw new Error('Utilisateur introuvable')

    const games = await prisma.game.findMany({
        where: {
            OR: [
                { playerWhiteId: user.id },
                { playerBlackId: user.id },
            ],
        },
        orderBy: {
            updatedAt: 'desc',
        },
        include: {
            playerWhite: {
                select: {
                    id: true,
                    name: true,
                    userDetails: { select: { username: true } },
                    image: true,
                },
            },
            playerBlack: {
                select: {
                    id: true,
                    name: true,
                    userDetails: { select: { username: true } },
                    image: true,
                },
            },
            moves: {
                orderBy: { moveNumber: 'asc' },
            },
        },
    })

    return games.map((game) => ({
        id: game.id,
        fen: game.moves.length > 0
            ? game.moves[game.moves.length - 1].fen
            : 'start',
        whitePlayer: {
            id: game.playerWhite.id,
            name: game.playerWhite.name,
            username: game.playerWhite.userDetails?.username || 'inconnu',
            avatar: game.playerWhite.image || '',
        },
        blackPlayer: {
            id: game.playerBlack.id,
            name: game.playerBlack.name,
            username: game.playerBlack.userDetails?.username || 'inconnu',
            avatar: game.playerBlack.image || '',
        },
    }))
}

export async function getGameById(gameId: string) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.email) throw new Error('Non autorisé')

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })
    if (!user) throw new Error('Utilisateur introuvable')

    const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: {
            moves: {
                orderBy: { moveNumber: 'asc' },
            },
            playerWhite: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    userDetails: { select: { username: true } },
                },
            },
            playerBlack: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    userDetails: { select: { username: true } },
                },
            },
        },
    })

    if (!game) throw new Error('Partie non trouvée')

    return {
        id: game.id,
        fen:
            game.moves.length > 0
                ? game.moves[game.moves.length - 1].fen
                : 'start',
        moves: game.moves,
        playerWhite: {
            id: game.playerWhite.id,
            name: game.playerWhite.name,
            avatar: game.playerWhite.image ?? '',
            username: game.playerWhite.userDetails?.username ?? 'inconnu',
        },
        playerBlack: {
            id: game.playerBlack.id,
            name: game.playerBlack.name,
            avatar: game.playerBlack.image ?? '',
            username: game.playerBlack.userDetails?.username ?? 'inconnu',
        },
    }
}

export async function updateUserProfile({
    username,
    name,
    email,
    bio,
}: {
    username: string;
    name: string;
    email: string;
    bio: string;
}) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) throw new Error('Non autorisé');

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            userDetails: true,
        },
    });

    if (!user) throw new Error('Utilisateur introuvable');

    // Update des informations dans user + userDetails
    await prisma.$transaction([
        prisma.user.update({
            where: { id: user.id },
            data: {
                name,
                email,
            },
        }),
        prisma.userDetails.upsert({
            where: { userId: user.id },
            update: {
                username,
                bio,
            },
            create: {
                userId: user.id,
                username,
                bio,
            },
        }),
    ]);

    return { success: true };
}

export async function getCurrentUserProfile() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) throw new Error('Non autorisé');

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            userDetails: true,
        },
    });

    if (!user) throw new Error('Utilisateur introuvable');

    return {
        username: user.userDetails?.username || '',
        name: user.name || '',
        email: user.email || '',
        bio: user.userDetails?.bio || '',
        joinedAt: user.createdAt?.toISOString() ?? null,
    };
}