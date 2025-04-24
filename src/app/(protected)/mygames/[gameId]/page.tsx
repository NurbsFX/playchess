'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Chess, Square } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { playMove, getGameById, getCurrentUserId } from '@/lib/action'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function GamePage() {
    const { gameId } = useParams()
    const [chess, setChess] = useState(new Chess())
    const [fen, setFen] = useState('start')
    const [selectedMove, setSelectedMove] = useState<{ from: string; to: string } | null>(null)
    const [previewFen, setPreviewFen] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    interface GameInfo {
        playerWhite: { id: string; name: string; image?: string } | null;
        playerBlack: { id: string; name: string; image?: string } | null;
        moves: { notation: string }[];
    }

    const [gameInfo, setGameInfo] = useState<GameInfo>({
        playerWhite: null,
        playerBlack: null,
        moves: [],
    })

    useEffect(() => {
        const load = async () => {
            setLoading(true)
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
                setFen(c.fen())
                setPreviewFen(null)
                setCurrentUserId(userId)
                setGameInfo(game)
            } catch (e) {
                console.error('Erreur lors du chargement de la partie', e)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [gameId])

    const getPlayerColor = () => {
        if (!currentUserId || !gameInfo?.playerWhite || !gameInfo?.playerBlack) return null
        if (gameInfo.playerWhite.id === currentUserId) return 'w'
        if (gameInfo.playerBlack.id === currentUserId) return 'b'
        return null
    }

    const isPlayerTurn = () => getPlayerColor() === chess.turn()

    const handleDrop = (from: string, to: string) => {
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
            setFen(updated.fen())
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

    const renderPlayer = (color: 'white' | 'black', player: { id: string; name: string; image?: string } | null) => (
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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Partie</h1>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr_300px] gap-6">
                <div>
                    {renderPlayer('white', gameInfo.playerWhite)}
                    {renderPlayer('black', gameInfo.playerBlack)}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-4 flex flex-col items-center">
                            {loading ? (
                                <Skeleton className="w-full aspect-square max-w-md" />
                            ) : (
                                <>
                                    <div className="w-full max-w-md">
                                        <Chessboard
                                            position={previewFen || fen}
                                            onPieceDrop={handleDrop}
                                            boardWidth={400}
                                            boardOrientation={getPlayerColor() === 'w' ? 'white' : 'black'}
                                            customBoardStyle={{
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            }}
                                        />
                                    </div>
                                    <div className="mt-4 text-center space-y-2">
                                        <p>
                                            C&apos;est au tour des{' '}
                                            <Badge variant={chess.turn() === 'w' ? 'outline' : 'default'}>
                                                {chess.turn() === 'w' ? 'Blancs' : 'Noirs'}
                                            </Badge>
                                        </p>
                                        {isPlayerTurn() ? (
                                            <p className="text-lg text-green-600 font-semibold">C&apos;est à vous de jouer !</p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">En attente du coup de l&apos;adversaire...</p>
                                        )}
                                    </div>
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