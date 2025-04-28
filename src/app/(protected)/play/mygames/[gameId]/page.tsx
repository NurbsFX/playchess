'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Chess, Square } from 'chess.js'
import GameBoard from '@/components/items/gameboard'
import MoveNavigator from '@/components/items/movenavigator'
import { getGameById, getCurrentUserId, playMove, getUserProfileById } from '@/lib/action'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function GamePage() {
    const { gameId } = useParams()
    const [chess, setChess] = useState(new Chess())
    const [selectedMove, setSelectedMove] = useState<{ from: string; to: string } | null>(null)
    const [previewFen, setPreviewFen] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [currentMove, setCurrentMove] = useState(0)

    interface GameInfo {
        playerWhite: { id: string; name: string; image?: string | null };
        playerBlack: { id: string; name: string; image?: string | null };
        moves: { notation: string }[];
    }

    const [gameInfo, setGameInfo] = useState<GameInfo | null>(null)

    useEffect(() => {
        const load = async () => {
            try {
                const [userId, game] = await Promise.all([
                    getCurrentUserId(),
                    getGameById(gameId as string),
                ])
                const c = new Chess()
                for (const move of game.moves) {
                    c.move(move.notation)
                }
                setChess(c)
                setCurrentMove(game.moves.length - 1)
                setPreviewFen(null)
                setSelectedMove(null)
                setCurrentUserId(userId)
                setGameInfo(game)
            } catch (error) {
                console.error('Erreur lors du chargement de la partie:', error)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [gameId])

    const getPlayerColor = (): 'w' | 'b' | null => {
        if (!currentUserId || !gameInfo?.playerWhite || !gameInfo?.playerBlack) return null
        if (gameInfo.playerWhite.id === currentUserId) return 'w'
        if (gameInfo.playerBlack.id === currentUserId) return 'b'
        return null
    }

    const isPlayerTurn = () => getPlayerColor() === chess.turn()

    const handleDrop = (from: string, to: string) => {
        if (!gameInfo || currentMove !== gameInfo.moves.length - 1) return false
        if (!isPlayerTurn()) return false
        const piece = chess.get(from as Square)
        if (!piece || piece.color !== getPlayerColor()) return false
        const newGame = new Chess(chess.fen())
        const move = newGame.move({ from, to, promotion: 'q' })
        if (move) {
            setSelectedMove({ from, to })
            setPreviewFen(newGame.fen())
            return true
        }
        return false
    }

    const handleConfirm = async () => {
        if (!selectedMove || !gameId) return
        try {
            await playMove(gameId as string, selectedMove.from, selectedMove.to)

            // Recharger la partie à jour
            const game = await getGameById(gameId as string)
            const c = new Chess()
            for (const move of game.moves) {
                c.move(move.notation)
            }

            setChess(c)
            setGameInfo(game)
            setCurrentMove(game.moves.length - 1)
            setPreviewFen(null)
            setSelectedMove(null)
        } catch (e) {
            console.error('Erreur lors du coup', e)
        }
    }

    const handleCancel = () => {
        setSelectedMove(null)
        setPreviewFen(null)
    }

    function PlayerCard({
        color,
        player,
        currentUserId,
    }: {
        color: 'white' | 'black';
        player: { id: string; name: string; image?: string | null } | null;
        currentUserId: string | null;
    }) {
        const [playerProfile, setPlayerProfile] = useState<{
            id: string;
            name: string;
            image?: string | null;
            username: string;
            flag: string;
            bio: string;
        } | null>(null);

        const [loading, setLoading] = useState(true);

        useEffect(() => {
            async function fetchPlayerProfile() {
                if (player?.id) {
                    try {
                        const data = await getUserProfileById(player.id);
                        setPlayerProfile(data);
                    } catch (error) {
                        console.error('Erreur lors du chargement du profil joueur :', error);
                    } finally {
                        setLoading(false);
                    }
                }
            }
            fetchPlayerProfile();
        }, [player?.id]);

        return (
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color === 'white' ? 'bg-white border' : 'bg-black'}`} />
                        {color === 'white' ? 'Joueur blanc' : 'Joueur noir'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading || !playerProfile ? (
                        <Skeleton className="h-10 w-10 rounded-full" />
                    ) : (
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={playerProfile.image || ""} alt={playerProfile.name || "Avatar"} />
                                <AvatarFallback>
                                    {playerProfile.name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            {/* Infos joueur */}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{playerProfile.flag}</span>
                                    <span className="font-semibold">{playerProfile.name}</span>
                                </div>
                                <span className="text-gray-500 text-sm">@{playerProfile.username}</span>

                                {playerProfile.id === currentUserId && (
                                    <Badge variant="outline" className="mt-1 w-fit">
                                        Vous
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    const displayedFen = useMemo(() => {
        if (!gameInfo) return 'start'
        const c = new Chess()
        for (let i = 0; i <= currentMove; i++) {
            const move = gameInfo.moves[i]
            if (move) c.move(move.notation)
        }
        return c.fen()
    }, [gameInfo, currentMove])

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Partie</h1>
            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr_300px] gap-6">
                <div>
                    <PlayerCard color="white" player={gameInfo?.playerWhite ?? null} currentUserId={currentUserId} />
                    <PlayerCard color="black" player={gameInfo?.playerBlack ?? null} currentUserId={currentUserId} />
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-4 flex flex-col items-center">
                            {loading || !gameInfo ? (
                                <Skeleton className="w-full aspect-square max-w-md" />
                            ) : (
                                <>
                                    <div className="w-full max-w-md flex flex-col items-center">
                                        <div className="mb-4">
                                            {isPlayerTurn() ? (
                                                <p className="text-sm text-green-600 font-semibold text-center">
                                                    C&apos;est à vous de jouer !
                                                </p>
                                            ) : (
                                                <p className="text-sm text-muted-foreground text-center">
                                                    En attente du coup de l&apos;adversaire...
                                                </p>
                                            )}
                                        </div>
                                        <GameBoard
                                            fen={previewFen || displayedFen}
                                            orientation={getPlayerColor() === 'w' ? 'white' : 'black'}
                                            variant="full"
                                            onDrop={currentMove === gameInfo.moves.length - 1 ? handleDrop : undefined}
                                        />
                                    </div>
                                    {!selectedMove && (
                                        <MoveNavigator
                                            currentMove={currentMove}
                                            totalMoves={gameInfo.moves.length}
                                            onFirst={() => setCurrentMove(0)}
                                            onPrev={() => setCurrentMove((prev) => Math.max(0, prev - 1))}
                                            onNext={() => setCurrentMove((prev) => Math.min(gameInfo.moves.length - 1, prev + 1))}
                                            onLast={() => setCurrentMove(gameInfo.moves.length - 1)}
                                        />
                                    )}
                                    {selectedMove && (
                                        <div className="mt-4 flex gap-2">
                                            <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
                                                Confirmer le coup {selectedMove.from} → {selectedMove.to}
                                            </Button>
                                            <Button onClick={handleCancel} variant="outline">
                                                Annuler
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}