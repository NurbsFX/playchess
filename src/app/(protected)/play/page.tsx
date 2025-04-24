'use client'

import { Chess, Square } from 'chess.js'
import { useEffect, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { playMove, getOngoingGame, getCurrentUserId } from '@/lib/action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'


export default function PlayPage() {
  const [gameId, setGameId] = useState<string | null>(null)
  const [fen, setFen] = useState('start')
  const [chess, setChess] = useState(new Chess())
  const [selectedMove, setSelectedMove] = useState<{ from: string; to: string } | null>(null)
  const [previewFen, setPreviewFen] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [gameInfo, setGameInfo] = useState<{
    playerWhite?: { id: string; name: string; image?: string | null }
    playerBlack?: { id: string; name: string; image?: string | null }
  }>({})

  const [ready, setReady] = useState(false)

  useEffect(() => {
    const loadGame = async () => {
      setLoading(true)
      try {
        const [userId, game] = await Promise.all([
          getCurrentUserId(),
          getOngoingGame(),
        ])

        if (!game?.playerWhite || !game?.playerBlack) {
          console.warn('Partie incomplète')
          return
        }

        const c = new Chess()
        for (const move of game.moves) {
          c.move(move.notation)
        }

        setChess(c)
        setFen(c.fen())
        setPreviewFen(null)
        setGameId(game.id)
        setGameInfo({
          playerWhite: game.playerWhite,
          playerBlack: game.playerBlack,
        })
        setCurrentUserId(userId)
        setReady(true)
      } catch (error) {
        console.error('Erreur lors du chargement de la partie:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGame()
  }, [])



  const getPlayerColor = (): 'w' | 'b' | null => {
    if (!ready || !currentUserId || !gameInfo.playerWhite || !gameInfo.playerBlack) return null
    if (gameInfo.playerWhite.id === currentUserId) return 'w'
    if (gameInfo.playerBlack.id === currentUserId) return 'b'
    return null
  }

  const isPlayerTurn = () => {
    const playerColor = getPlayerColor()
    return playerColor === chess.turn()
  }

  const handleDrop = (sourceSquare: string, targetSquare: string) => {
    const playerColor = getPlayerColor()

    if (!isPlayerTurn() || !playerColor) return false

    const piece = chess.get(sourceSquare as Square)
    if (!piece || piece.color !== playerColor) return false

    const chessCopy = new Chess(chess.fen())
    const move = chessCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })

    if (move) {
      setSelectedMove({ from: sourceSquare, to: targetSquare })
      setPreviewFen(chessCopy.fen())
      return true
    }

    return false
  }

  const handleConfirm = async () => {
    if (!selectedMove || !gameId) return
    try {
      await playMove(gameId, selectedMove.from, selectedMove.to)
      const updated = new Chess(chess.fen())
      updated.move({ from: selectedMove.from, to: selectedMove.to, promotion: 'q' })
      setChess(updated)
      setFen(updated.fen())
      setPreviewFen(null)
      setSelectedMove(null)
    } catch (error) {
      console.error('Erreur lors du coup:', error)
    }
  }

  const handleCancel = () => {
    setSelectedMove(null)
    setPreviewFen(null)
  }




  const renderPlayerCard = (
    color: 'white' | 'black',
    player: { id: string; name: string; image?: string | null } | undefined
  ) => {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color === 'white' ? 'bg-white border' : 'bg-black'}`} />
            {color === 'white' ? 'Joueur blanc' : 'Joueur noir'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : player ? (
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={player.image || ''} />
                <AvatarFallback>
                  {player.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">{player.name}</span>
                {player.id === currentUserId && (
                  <span className="text-xs mt-1 text-muted-foreground">
                    <Badge variant="outline">Vous</Badge>
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">En attente...</p>
          )}
        </CardContent>
      </Card>
    )
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Partie en cours</h1>


      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr_300px] gap-6">
        {/* Joueurs */}
        <div>
          {renderPlayerCard('white', gameInfo.playerWhite)}
          {renderPlayerCard('black', gameInfo.playerBlack)}
        </div>

        {/* Échiquier */}
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
                      <p className="text-lg text-green-600 font-semibold">C'est à vous de jouer !</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">En attente du coup de l'adversaire...</p>
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