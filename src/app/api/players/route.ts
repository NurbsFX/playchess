// app/api/players/route.ts

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                userDetails: {
                    select: {
                        username: true,
                    },
                },
                ratingHistories: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: {
                        rating: true,
                    },
                },
            },
        })

        // Formatage propre : on extrait le rating directement
        const usersWithElo = users.map((user) => ({
            ...user,
            elo: user.ratingHistories[0]?.rating ?? null,
        }))

        return NextResponse.json(usersWithElo)
    } catch (error) {
        console.error('[GET_USERS_ERROR]', error)
        return new NextResponse('Erreur lors de la récupération des utilisateurs', {
            status: 500,
        })
    }
}