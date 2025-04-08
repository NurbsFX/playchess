"use client";

import { columns } from "./columns"; // Ton fichier columns adapté au classement
import { DataTable } from "./data-table"; // Ton data-table responsive

export type Player = {
    rank: number;
    name: string;
    username: string;
    avatar: string;
    score: number;
    country: string;
    wins: number;
    losses: number;
    draws: number;
};

export const players: Player[] = [
    {
        rank: 1,
        name: "Amine Dupont",
        username: "chessMaster42",
        avatar: "/avatars/amine.png",
        score: 2480,
        country: "🇫🇷",
        wins: 120,
        losses: 30,
        draws: 10,
    },
    {
        rank: 2,
        name: "Sophie Bernard",
        username: "rookQueen",
        avatar: "/avatars/sophie.png",
        score: 2415,
        country: "🇨🇦",
        wins: 100,
        losses: 25,
        draws: 15,
    },
    {
        rank: 3,
        name: "Lucas Garcia",
        username: "knightRider",
        avatar: "/avatars/lucas.png",
        score: 2380,
        country: "🇪🇸",
        wins: 95,
        losses: 40,
        draws: 5,
    },
    {
        rank: 4,
        name: "Olivia Smith",
        username: "bishopBoss",
        avatar: "/avatars/olivia.png",
        score: 2340,
        country: "🇬🇧",
        wins: 90,
        losses: 35,
        draws: 10,
    },
    {
        rank: 5,
        name: "Noah Müller",
        username: "pawnStar",
        avatar: "/avatars/noah.png",
        score: 2300,
        country: "🇩🇪",
        wins: 85,
        losses: 50,
        draws: 5,
    },
    {
        rank: 6,
        name: "Bruno Silva",
        username: "nurbsfx",
        avatar: "/avatars/noah.png",
        score: 2250,
        country: "🇩🇪",
        wins: 84,
        losses: 50,
        draws: 5,
    },
];

export default function LeaderboardPage() {

    return (
        <div className="container mx-auto py-10 ">
            <h1 className="text-3xl md:text-5xl font-bold text-center mb-8 text-[#27272A] dark:text-white">
                Classement des meilleurs joueurs
            </h1>

            <DataTable columns={columns} data={players} />
        </div>
    );
}