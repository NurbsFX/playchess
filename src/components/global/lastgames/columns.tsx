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
                <div className="grid place-items-center gap-2 text-center min-w-[180px]">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={player.avatar} alt={player.name} />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-bold">{player.name}</div>
                    <div className="text-sm text-gray-500">{player.username}</div>
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
                <div className="grid place-items-center gap-2 text-center min-w-[180px]">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={player.avatar} alt={player.name} />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-bold">{player.name}</div>
                    <div className="text-sm text-gray-500">{player.username}</div>
                </div>
            );
        },
    },
    {
        accessorKey: "fen",
        header: "Aperçu",
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <div className=" w-[100px] h-[100px]">
                    < Chessboard
                        position={row.original.fen}
                        arePiecesDraggable={false}
                        boardWidth={100}
                        customBoardStyle={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        }}
                    />
                </div >
            </div>
        ),
    },
    {
        accessorKey: "result",
        header: "Victoire",
        cell: ({ row }) => {
            const result = row.original.result;
            return (
                <div className="flex items-center justify-center">
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
                </div>
            );
        },
    }
];