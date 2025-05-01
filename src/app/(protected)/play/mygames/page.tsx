// app/mygames/page.tsx

import { getAllGamesForCurrentUser, getCurrentUserId, UserGameSummary, archiveGame } from '@/lib/action'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import GameBoard from '@/components/items/gameboard'
import { Trophy, Archive } from 'lucide-react'
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { JSX } from 'react'

export default async function GamesPage() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.email) return notFound()

    const currentUserId = await getCurrentUserId()
    // on ne reçoit plus que les non-archivées en base
    const games: UserGameSummary[] = await getAllGamesForCurrentUser()

    // Si pas de parties, proposer un nouvel adversaire
    if (games.length === 0) {
        return (
            <div className=" container mx-auto py-16 text-center h-screen ">
                <p className="text-xl font-medium mb-6">Vous n’avez aucune partie en cours.</p>
                <Link href="/play/versus">
                    <Button size="lg" className="px-8 bg-[#6890C9] hover:bg-[#6890c9d8]">
                        Trouver un nouvel adversaire
                    </Button>
                </Link>
            </div>
        )
    }

    const groupedGames: UserGameSummary[][] = []
    for (let i = 0; i < games.length; i += 3) {
        groupedGames.push(games.slice(i, i + 3))
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Mes parties</h1>

            {groupedGames.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {row.map((game) => {
                        const amWhite = game.whitePlayer.id === currentUserId

                        let badge: JSX.Element | null = null
                        if (game.status === 'FINISHED') {
                            const isWin =
                                (game.result === 'WHITE_WIN' && amWhite) ||
                                (game.result === 'BLACK_WIN' && !amWhite)
                            const isLoss =
                                (game.result === 'WHITE_WIN' && !amWhite) ||
                                (game.result === 'BLACK_WIN' && amWhite)

                            if (isWin) {
                                badge = (
                                    <Badge className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                        <Trophy className="w-4 h-4" />
                                        Vous avez gagné 🎉
                                    </Badge>
                                )
                            } else if (isLoss) {
                                badge = (
                                    <Badge className="flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full">
                                        <Trophy className="w-4 h-4" />
                                        Vous avez perdu 💀
                                    </Badge>
                                )
                            } else {
                                badge = (
                                    <Badge className="flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                                        🤝 Match nul
                                    </Badge>
                                )
                            }
                        }

                        return (
                            <Card key={game.id} className="overflow-hidden cursor-pointer ">
                                <CardHeader className="p-2">
                                    <CardTitle className="text-sm font-medium text-center">
                                        <div className="grid place-items-center gap-1">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={game.blackPlayer.avatar}
                                                    alt={game.blackPlayer.name}
                                                />
                                                <AvatarFallback>
                                                    {game.blackPlayer.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <Badge className="bg-[#27272a] text-white px-3 py-1 rounded-full">
                                                <span className="font-bold">{game.blackPlayer.name}</span>
                                                <span className="text-xs block">
                                                    @{game.blackPlayer.username}
                                                </span>
                                            </Badge>
                                        </div>
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="flex justify-center items-center">
                                    <div className="aspect-square">
                                        <Link
                                            href={`/play/mygames/${game.id}`}
                                            className="block hover:scale-[1.01] transition-transform"
                                        >
                                            <GameBoard
                                                variant="mini"
                                                fen={game.fen}
                                                orientation="white"
                                                showStats={false}
                                            />
                                        </Link>
                                    </div>
                                </CardContent>

                                <div className="p-2">
                                    <div className="grid place-items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={game.whitePlayer.avatar}
                                                alt={game.whitePlayer.name}
                                            />
                                            <AvatarFallback>
                                                {game.whitePlayer.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Badge className="bg-white text-[#27272a] border border-[#27272a] px-3 py-1 rounded-full">
                                            <span className="font-bold">
                                                {game.whitePlayer.name}
                                            </span>
                                            <span className="text-xs block">
                                                @{game.whitePlayer.username}
                                            </span>
                                        </Badge>
                                    </div>
                                </div>

                                {badge && (
                                    <div className="flex justify-center items-center gap-2 pb-4">
                                        {badge}
                                        <form action={archiveGame}>
                                            <input type="hidden" name="gameId" value={game.id} />
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            type="submit"
                                                            variant="ghost"
                                                            size="sm"
                                                            title="Archiver"
                                                        >
                                                            <Archive className="w-4 h-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Archiver la partie</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </form>
                                    </div>
                                )}
                            </Card>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}