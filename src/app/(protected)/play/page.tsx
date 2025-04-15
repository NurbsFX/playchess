'use client'

import { Chess, Square } from 'chess.js'
import { useEffect, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { playMove, getOngoingGame } from '@/lib/action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send } from 'lucide-react'

export default function PlayPage() {
  const [gameId, setGameId] = useState<string | null>(null)
  const [fen, setFen] = useState('start')
  const [chess, setChess] = useState(new Chess())
  const [selectedMove, setSelectedMove] = useState<{ from: string; to: string } | null>(null)
  const [previewFen, setPreviewFen] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [gameInfo, setGameInfo] = useState<{
    playerWhite?: { id: string; name: string; image?: string | null };
    playerBlack?: { id: string; name: string; image?: string | null };
  }>({})

  useEffect(() => {
    const loadGame = async () => {
      setLoading(true)
      try {
        const game = await getOngoingGame()
        if (game) {
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
            playerBlack: game.playerBlack
          })

          // Déterminer l'ID de l'utilisateur actuel à partir des données du jeu
          // Nous allons utiliser une approche différente pour obtenir l'ID de l'utilisateur
          // en vérifiant si l'utilisateur est le joueur blanc ou noir
          if (game.playerWhite && game.playerBlack) {
            // Nous allons simplement définir l'ID de l'utilisateur actuel comme étant celui du joueur blanc
            // Dans une implémentation réelle, vous devriez obtenir l'ID de l'utilisateur connecté
            // via une API ou un contexte d'authentification
            setCurrentUserId(game.playerWhite.id)
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la partie:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGame()
  }, [])

  // Vérifie si c'est le tour du joueur actuel
  const isPlayerTurn = () => {
    if (!currentUserId || !gameInfo.playerWhite || !gameInfo.playerBlack) return false

    const isWhitePlayer = currentUserId === gameInfo.playerWhite.id
    const isBlackPlayer = currentUserId === gameInfo.playerBlack.id

    return (isWhitePlayer && chess.turn() === 'w') || (isBlackPlayer && chess.turn() === 'b')
  }

  // Vérifie si le joueur actuel est le joueur blanc
  const isWhitePlayer = () => {
    if (!currentUserId || !gameInfo.playerWhite) return false
    return currentUserId === gameInfo.playerWhite.id
  }

  // Vérifie si le joueur actuel est le joueur noir
  const isBlackPlayer = () => {
    if (!currentUserId || !gameInfo.playerBlack) return false
    return currentUserId === gameInfo.playerBlack.id
  }

  const handleDrop = (sourceSquare: string, targetSquare: string) => {
    // Vérifier si c'est le tour du joueur
    if (!isPlayerTurn()) {
      return false
    }

    // Vérifier si le joueur essaie de déplacer une pièce de sa couleur
    const piece = chess.get(sourceSquare as Square)
    if (!piece) return false

    const isWhitePiece = piece.color === 'w'
    if ((isWhitePiece && !isWhitePlayer()) || (!isWhitePiece && !isBlackPlayer())) {
      return false
    }

    // Créer une copie de l'état actuel du jeu
    const chessCopy = new Chess(chess.fen())

    // Vérifier si le coup est valide
    const move = chessCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })
    if (move) {
      // Si le coup est valide, mettre à jour l'état
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Message à envoyer:', message)
    setMessage('')
  }

  const renderPlayerCard = (
    color: 'white' | 'black',
    player:
      | { id: string; name: string; image?: string | null }
      | undefined
  ) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${color === 'white' ? 'bg-white border' : 'bg-black'
              }`}
          ></div>
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
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={player.image || ''} />
              <AvatarFallback>
                {player.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{player.name}</span>
            {currentUserId === player.id && (
              <Badge variant="outline" className="ml-2">Vous</Badge>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">En attente...</p>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Partie en cours</h1>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr_300px] gap-6">
        {/* Colonne joueurs */}
        <div>
          {renderPlayerCard('white', gameInfo.playerWhite)}
          {renderPlayerCard('black', gameInfo.playerBlack)}
        </div>

        {/* Colonne échiquier */}
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
                      boardOrientation={isWhitePlayer() ? 'white' : 'black'}
                      customBoardStyle={{
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-lg font-medium">
                      Au tour des{' '}
                      <Badge variant={chess.turn() === 'w' ? 'outline' : 'default'}>
                        {chess.turn() === 'w' ? 'Blancs' : 'Noirs'}
                      </Badge>
                      {!isPlayerTurn() && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          <br />
                          (En attente du coup de l&apos;adversaire)
                        </span>
                      )}
                    </p>
                  </div>
                  {selectedMove && (
                    <div className="mt-4 flex gap-2">
                      <Button
                        onClick={handleConfirm}
                        className="bg-green-600 hover:bg-green-700"
                      >
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

        {/* Colonne messagerie */}
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Messagerie</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <div className="bg-muted p-3 rounded-lg max-w-[80%] self-start">
                      <p className="text-sm">Bonjour ! Bonne partie !</p>
                      <p className="text-xs text-muted-foreground mt-1">10:30</p>
                    </div>
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%] self-end">
                      <p className="text-sm">Merci, à toi aussi !</p>
                      <p className="text-xs text-primary-foreground/80 mt-1">10:31</p>
                    </div>
                    <div className="bg-muted p-3 rounded-lg max-w-[80%] self-start">
                      <p className="text-sm">J&apos;ai hésité sur ce coup...</p>
                      <p className="text-xs text-muted-foreground mt-1">10:35</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                <Input
                  placeholder="Tapez votre message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}