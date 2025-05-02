// app/actions/server.ts
'use server'

import { PrismaClient, GameStatus, InvitationStatus, GameResult, User } from '@prisma/client'
import { auth } from '@/lib/auth'
import { headers } from "next/headers";
import { Chess } from 'chess.js'
import { revalidatePath } from 'next/cache'


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

export interface GameData {
    id: string
    playerWhite: { id: string; name: string; image?: string | null }
    playerBlack: { id: string; name: string; image?: string | null }
    moves: { notation: string; fen: string; moveNumber: number }[]
    status: GameStatus
    result: GameResult
    // … le reste si besoin
}


export interface UserGameSummary {
    id: string
    fen: string
    whitePlayer: {
        id: string
        name: string
        username: string
        avatar: string
    }
    blackPlayer: {
        id: string
        name: string
        username: string
        avatar: string
    }
    status: GameStatus
    result: GameResult
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
                // ↙ ici on crée les deux entrées pivot MyGames
                myGames: {
                    createMany: {
                        data: [
                            { userId: whiteId },
                            { userId: blackId },
                        ],
                    },
                },
            },
            include: { myGames: true },
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

// app/actions/server.ts
export async function getAllGamesForCurrentUser(): Promise<UserGameSummary[]> {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.email) throw new Error('Non autorisé')

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })
    if (!user) throw new Error('Utilisateur introuvable')

    const games = await prisma.game.findMany({
        where: {
            // on ne garde que les parties liées à l’utilisateur ET non archivées
            myGames: {
                some: {
                    userId: user.id,
                    archived: false,
                },
            },
        },
        include: {
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
            moves: { orderBy: { moveNumber: 'asc' } },
        },
        orderBy: { updatedAt: 'desc' },
    })

    return games.map((game) => ({
        id: game.id,
        fen:
            game.moves.length > 0
                ? game.moves[game.moves.length - 1].fen
                : 'start',
        whitePlayer: {
            id: game.playerWhite.id,
            name: game.playerWhite.name,
            username: game.playerWhite.userDetails?.username ?? 'inconnu',
            avatar: game.playerWhite.image ?? '',
        },
        blackPlayer: {
            id: game.playerBlack.id,
            name: game.playerBlack.name,
            username: game.playerBlack.userDetails?.username ?? 'inconnu',
            avatar: game.playerBlack.image ?? '',
        },
        status: game.status,
        result: game.result,
    }))
}

export async function getGameById(gameId: string): Promise<GameData> {
    // … auth/session idem
    const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: {
            moves: { orderBy: { moveNumber: 'asc' } },
            playerWhite: { select: { id: true, name: true, image: true } },
            playerBlack: { select: { id: true, name: true, image: true } },
        },
    })
    if (!game) throw new Error('Partie non trouvée')

    return {
        id: game.id,
        playerWhite: {
            id: game.playerWhite.id,
            name: game.playerWhite.name,
            image: game.playerWhite.image,
        },
        playerBlack: {
            id: game.playerBlack.id,
            name: game.playerBlack.name,
            image: game.playerBlack.image,
        },
        moves: game.moves.map((m) => ({
            notation: m.notation,
            fen: m.fen,
            moveNumber: m.moveNumber,
        })),
        status: game.status,
        result: game.result,
    }
}

export async function updateUserProfile({
    username,
    name,
    email,
    flag,
    bio,
    image,
}: {
    username: string;
    name: string;
    email: string;
    flag: string;
    bio: string;
    image: string;
}) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) throw new Error('Non autorisé');

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { userDetails: true },
    });

    if (!currentUser) throw new Error('Utilisateur introuvable');

    // Vérifier si l'email est utilisé par un autre utilisateur
    if (email !== currentUser.email) {
        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });
        if (existingEmail) throw new Error('Cet email est déjà utilisé.');
    }

    // Vérifier si le username est utilisé par un autre utilisateur
    if (username !== currentUser.userDetails?.username) {
        const existingUsername = await prisma.userDetails.findFirst({
            where: { username },
        });
        if (existingUsername) throw new Error('Ce nom d\'utilisateur est déjà pris.');
    }

    await prisma.$transaction([
        prisma.user.update({
            where: { id: currentUser.id },
            data: {
                name,
                email,
                image,
            },
        }),
        prisma.userDetails.upsert({
            where: { userId: currentUser.id },
            update: {
                username,
                flag,
                bio,
            },
            create: {
                userId: currentUser.id,
                username,
                flag,
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

export async function getFullCurrentUserProfile() {
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
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        username: user.userDetails?.username || '',
        bio: user.userDetails?.bio || '',
        flag: user.userDetails?.flag || '🏳️', // important pour le problème du drapeau
    };
}

export async function getUserProfileById(userId: string) {
    if (!userId) throw new Error('ID utilisateur invalide');

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            userDetails: true,
        },
    });

    if (!user) throw new Error('Utilisateur introuvable');

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        username: user.userDetails?.username || '',
        bio: user.userDetails?.bio || '',
        flag: user.userDetails?.flag || '🏳️', // le drapeau par défaut si manquant
    };
}

export async function updateElo(playerRating: number, opponentRating: number, result: number, K: number = 32): Promise<number> {
    if (
        typeof playerRating !== 'number' ||
        typeof opponentRating !== 'number' ||
        typeof result !== 'number' ||
        (result !== 0 && result !== 0.5 && result !== 1)
    ) {
        throw new Error('Invalid input');
    }

    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    const newRating = playerRating + K * (result - expectedScore);

    return Math.round(newRating);
}

export async function createUserDetails(data: {
    username: string
    country?: string
    flag?: string
    bio?: string
}) {
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id

    if (!userId) {
        throw new Error("Utilisateur non connecté")
    }

    // Create user details
    const userDetails = await prisma.userDetails.create({
        data: {
            userId,
            username: data.username,
            country: data.country,
            flag: data.flag,
            bio: data.bio,
        },
    })

    return userDetails
}

export async function finishGame(
    gameId: string,
    result: 'WHITE_WIN' | 'BLACK_WIN' | 'DRAW'
) {
    const res = await fetch(`/api/games/${gameId}/finish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result }),
    })
    if (!res.ok) {
        console.error('Erreur API finishGame:', await res.text())
    }
    return res.json()
}

export async function syncGameResult(
    gameId: string,
    result: Extract<GameResult, 'WHITE_WIN' | 'BLACK_WIN' | 'DRAW'>
) {
    // Récupère le status actuel
    const existing = await prisma.game.findUnique({
        where: { id: gameId },
        select: { status: true },
    })
    if (existing?.status === GameStatus.ONGOING) {
        await prisma.game.update({
            where: { id: gameId },
            data: {
                status: GameStatus.FINISHED,
                result: result,
                endedAt: new Date(),
            },
        })
    }
}

export async function archiveGame(formData: FormData) {
    'use server'
    const gameId = formData.get('gameId')?.toString()
    if (!gameId) throw new Error('gameId manquant')

    // Authentification
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.email) throw new Error('Non autorisé')

    // Récupérer l'ID utilisateur
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    })
    if (!user) throw new Error('Utilisateur introuvable')

    // Mettre à jour l'entrée pivot MyGames pour cet user + game
    await prisma.myGames.update({
        where: {
            userId_gameId: {
                userId: user.id,
                gameId: gameId,
            },
        },
        data: {
            archived: true,
        },
    })

    // Revalider la page mes parties
    revalidatePath('/mygames')
}

export async function deleteAccountAction(formData: FormData): Promise<void> {
    'use server'
    const password = formData.get('password')?.toString()
    if (!password) throw new Error('Mot de passe manquant')

    // (1) Récupérez l’utilisateur courant
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.email) throw new Error('Non autorisé')

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) throw new Error('Utilisateur introuvable')

    // (2) Vérifiez que le mot de passe est correct…
    //    (implémentation dépend de votre gestion d’auth, p.ex. comparez avec bcrypt)

    // (3) Supprimez l’utilisateur et toutes ses dépendances
    await prisma.$transaction([
        prisma.gameInvitation.deleteMany({ where: { OR: [{ senderId: user.id }, { receiverId: user.id }] } }),
        prisma.myGames.deleteMany({ where: { userId: user.id } }),
        prisma.move.deleteMany({ where: { game: { playerWhiteId: user.id } } }),
        prisma.move.deleteMany({ where: { game: { playerBlackId: user.id } } }),
        prisma.game.deleteMany({ where: { OR: [{ playerWhiteId: user.id }, { playerBlackId: user.id }] } }),
        prisma.userDetails.deleteMany({ where: { userId: user.id } }),
        prisma.account.deleteMany({ where: { userId: user.id } }),
        prisma.session.deleteMany({ where: { userId: user.id } }),
        prisma.user.delete({ where: { id: user.id } }),
    ])

    // (4) Force le rafraîchissement de la page /myaccount
    revalidatePath('/myaccount')
}
