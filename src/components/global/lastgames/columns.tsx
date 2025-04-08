"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Chessboard } from "react-chessboard";

// Typage d'une partie
export type Game = {
    id: number;
    whitePlayer: {
        name: string;
        username: string;
        avatar: string;
    };
    blackPlayer: {
        name: string;
        username: string;
        avatar: string;
    };
    fen: string; // Position FEN de fin de partie
    result: "white" | "black" | "draw"; // Résultat
};

export const columns: ColumnDef<Game>[] = [
    {
        accessorKey: "whitePlayer",
        header: "Blancs",
        cell: ({ row }) => {
            const player = row.original.whitePlayer;
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={player.avatar} alt={player.name} />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold">{player.name}</span>
                        <span className="text-sm text-gray-500">@{player.username}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "blackPlayer",
        header: "Noirs",
        cell: ({ row }) => {
            const player = row.original.blackPlayer;
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={player.avatar} alt={player.name} />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold">{player.name}</span>
                        <span className="text-sm text-gray-500">@{player.username}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "fen",
        header: "Aperçu",
        cell: ({ row }) => (
            <div className="w-[100px] h-[100px]">
                <Chessboard
                    position={row.original.fen}
                    arePiecesDraggable={false}
                    boardWidth={100}
                    customBoardStyle={{
                        borderRadius: "8px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                />
            </div>
        ),
    },
    {
        accessorKey: "result",
        header: "Victoire",
        cell: ({ row }) => {
            const result = row.original.result;
            return (
                <Badge
                    className={
                        result === "white"
                            ? "bg-white text-[#27272A] border border-gray-400 shadow-sm" // ➔ Ajout d'une bordure + ombre
                            : result === "black"
                                ? "bg-[#27272A] text-white border border-gray-400 shadow-sm"
                                : "bg-gray-500 text-white border border-gray-400 shadow-sm"
                    }
                >
                    {result === "white" ? "Blancs" : result === "black" ? "Noirs" : "Nulle"}
                </Badge>
            );
        },
    }
];