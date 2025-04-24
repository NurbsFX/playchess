'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Chess, Square } from 'chess.js'
import GameBoard from '@/components/items/gameboard'
import MoveNavigator from '@/components/items/movenavigator'
import { getGameById, getCurrentUserId, playMove } from '@/lib/action'
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
            const updated = new Chess(chess.fen())
            updated.move({ from: selectedMove.from, to: selectedMove.to, promotion: 'q' })
            setChess(updated)
            setPreviewFen(null)
            setSelectedMove(null)
            setCurrentMove((prev) => prev + 1)
        } catch (e) {
            console.error('Erreur lors du coup', e)
        }
    }

    const handleCancel = () => {
        setSelectedMove(null)
        setPreviewFen(null)
    }

    const renderPlayer = (
        color: 'white' | 'black',
        player: { id: string; name: string; image?: string | null } | null
    ) => (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color === 'white' ? 'bg-white border' : 'bg-black'}`} />
                    {color === 'white' ? 'Joueur blanc' : 'Joueur noir'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-10 w-10 rounded-full" />
                ) : (
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={player?.image || ''} />
                            <AvatarFallback>{player?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-semibold">{player?.name}</span>
                            {player?.id === currentUserId && <Badge variant="outline">Vous</Badge>}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )

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
                    {renderPlayer('white', gameInfo?.playerWhite ?? null)}
                    {renderPlayer('black', gameInfo?.playerBlack ?? null)}
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-4 flex flex-col items-center">
                            {loading || !gameInfo ? (
                                <Skeleton className="w-full aspect-square max-w-md" />
                            ) : (
                                <>
                                    <div className="w-full max-w-md">
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