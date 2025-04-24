// app/mygames/page.tsx

import { getAllGamesForCurrentUser } from '@/lib/action'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import GameBoard from '@/components/items/gameboard'

export default async function GamesPage() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.email) return notFound()

    const games = await getAllGamesForCurrentUser()

    const groupedGames = []
    for (let i = 0; i < games.length; i += 3) {
        groupedGames.push(games.slice(i, i + 3))
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Mes parties</h1>

            {groupedGames.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {row.map((game) => (
                        <Link
                            href={`/mygames/${game.id}`}
                            key={game.id}
                            className="block hover:scale-[1.01] transition-transform"
                        >
                            <Card className="overflow-hidden cursor-pointer hover:scale-[1.01] hover:shadow-md">
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
                                        <GameBoard
                                            variant="mini"
                                            fen={game.fen}
                                            orientation="white" // peu importe ici, c'est une preview
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
            ))}
        </div>
    )
}