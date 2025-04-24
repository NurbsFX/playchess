'use client'

import { useEffect, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getAllGamesForCurrentUser } from '@/lib/action'
import Link from 'next/link'

interface Game {
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
}

export default function GamesPage() {
    const [games, setGames] = useState<Game[][]>([])

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const data = await getAllGamesForCurrentUser()
                // Group the games into rows of 3
                const grouped = []
                for (let i = 0; i < data.length; i += 3) {
                    grouped.push(data.slice(i, i + 3))
                }
                setGames(grouped)
            } catch (error) {
                console.error('Erreur lors du chargement des parties:', error)
            }
        }

        fetchGames()
    }, [])

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Mes parties</h1>

            {games.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {row.map((game) => (
                        <Link href={`/mygames/${game.id}`} key={game.id} className="block hover:scale-[1.01] transition-transform">
                            <Card className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.01] hover:shadow-md">
                                <CardHeader className="p-2">
                                    <CardTitle className="text-sm font-medium text-center">
                                        <div className="grid place-items-center gap-1">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={game.blackPlayer.avatar} alt={game.blackPlayer.name} />
                                                <AvatarFallback>{game.blackPlayer.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <Badge className="bg-[#27272a] text-white px-3 py-1 text-center">
                                                <div className="font-bold">{game.blackPlayer.name}</div>
                                                <div className="text-sm text-gray-200">@{game.blackPlayer.username}</div>
                                            </Badge>
                                        </div>
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="flex justify-center items-center">
                                    <div className="aspect-square">
                                        <Chessboard
                                            position={game.fen}
                                            boardWidth={200}
                                            arePiecesDraggable={false}
                                            customBoardStyle={{
                                                borderRadius: '4px',
                                                boxShadow: '0 1px 8px rgba(0, 0, 0, 0.3)',
                                            }}
                                        />
                                    </div>
                                </CardContent>

                                <div className="p-2">
                                    <div className="grid place-items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={game.whitePlayer.avatar} alt={game.whitePlayer.name} />
                                            <AvatarFallback>{game.whitePlayer.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <Badge className="bg-white text-[#27272a] border border-[#27272a] px-3 py-1 text-center">
                                            <div className="font-bold">{game.whitePlayer.name}</div>
                                            <div className="text-sm text-gray-500">@{game.whitePlayer.username}</div>
                                        </Badge>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            ))
            }
        </div >
    )
}