// app/api/init-elo/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // adapte le chemin si besoin

export async function POST() {
    try {
        const users = await prisma.user.findMany();

        const createRatings = users.map((user) =>
            prisma.ratingHistory.create({
                data: {
                    userId: user.id,
                    rating: 1000,
                },
            })
        );

        await Promise.all(createRatings);

        return NextResponse.json({ success: true, message: 'Elo initialized to 1000 for all users.' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'An error occurred.' }, { status: 500 });
    }
}