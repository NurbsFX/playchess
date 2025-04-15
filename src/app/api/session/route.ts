import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


const prisma = new PrismaClient()

export async function GET() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user?.email) {
            return new NextResponse('Non autorisé', { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
                updatedAt: true,
                userDetails: {
                    select: {
                        username: true,
                        country: true,
                        bio: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        })

        if (!user) {
            return new NextResponse('Utilisateur non trouvé', { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('[SESSION_GET_ERROR]', error)
        return new NextResponse('Erreur serveur', { status: 500 })
    }
}