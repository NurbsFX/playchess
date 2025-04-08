"use client";

import { columns, Game } from "./columns";
import { DataTable } from "./data-table";

const games: Game[] = [
    {
        id: 1,
        whitePlayer: { name: "Amine Dupont", username: "@helloworld", avatar: "/avatars/amine.png" },
        blackPlayer: { name: "Lucas Garcia", username: "@helloworld", avatar: "/avatars/lucas.png" },
        fen: "8/8/8/8/8/8/8/8 w - - 0 1", // FEN vide ici, tu peux en mettre des vraies
        result: "white",
    },
    {
        id: 2,
        whitePlayer: { name: "Sophie Bernard", username: "@helloworld", avatar: "/avatars/sophie.png" },
        blackPlayer: { name: "Noah Müller", username: "@helloworld", avatar: "/avatars/noah.png" },
        fen: "8/8/8/8/8/8/8/8 w - - 0 1",
        result: "draw",
    },
    {
        id: 3,
        whitePlayer: { name: "Olivia Smith", username: "@helloworld", avatar: "/avatars/olivia.png" },
        blackPlayer: { name: "Amine Dupont", username: "@helloworld", avatar: "/avatars/amine.png" },
        fen: "8/8/8/8/8/8/8/8 w - - 0 1",
        result: "black",
    },
];

export default function LastGamesPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl md:text-5xl font-bold text-center mb-8 text-[#27272A] dark:text-white">
                Dernières Parties Terminées
            </h1>

            <DataTable columns={columns} data={games} />
        </div>
    );
}