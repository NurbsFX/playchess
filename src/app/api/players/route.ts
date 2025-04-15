// app/api/users/route.ts

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
                emailVerified: true,
                image: true,
                createdAt: true,
                updatedAt: true,
                userDetails: {
                    select: {
                        username: true,
                        country: true,
                        bio: true,
                    },
                },
            },
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error('[GET_USERS_ERROR]', error)
        return new NextResponse('Erreur lors de la récupération des utilisateurs', {
            status: 500,
        })
    }
}