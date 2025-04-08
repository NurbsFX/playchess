"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// TypeScript : typage de ton joueur
export type Player = {
    name: string;
    username: string;
    avatar: string;
    score: number;
    country: string;
    wins: number;
    losses: number;
    draws: number;
};

export const columns: ColumnDef<Player>[] = [
    {
        id: "rank",
        header: "Rang",
        cell: ({ row }) => (
            <Badge className="bg-[#6890C9] text-white px-3 py-1">
                #{row.index + 1}
            </Badge>
        ),
    },
    {
        accessorKey: "name",
        header: "Joueur",
        cell: ({ row }) => (
            <div className="grid place-items-center gap-2 text-center min-w-[180px]">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={row.original.avatar} alt={row.original.name} />
                    <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="font-bold">{row.original.name}</div>
                <div className="text-sm text-gray-500">@{row.original.username}</div>
            </div>
        ),
    },
    {
        accessorKey: "score",
        header: "ELO",
        cell: ({ row }) => (
            <div className="text-center font-bold">{row.original.score}</div>
        ),
    },
    {
        accessorKey: "country",
        header: "Pays",
        cell: ({ row }) => (
            <div className="text-center text-2xl">{row.original.country}</div>
        ),
    },
    {
        id: "stats",
        header: "Statistiques",
        cell: ({ row }) => {
            const { wins, losses, draws } = row.original;
            return (
                <div className="flex flex-col text-xs text-center gap-1 text-gray-600 dark:text-gray-400">
                    <span>🏆 {wins} victoires</span>
                    <span>❌ {losses} défaites</span>
                    <span>🤝 {draws} nulles</span>
                </div>
            );
        },
    },
];