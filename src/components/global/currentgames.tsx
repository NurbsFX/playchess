"use client";

import { Chessboard } from "react-chessboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";

// Données fictives pour les parties en cours
const currentGames = [
  // Première ligne
  [
    {
      id: 1,
      whitePlayer: {
        name: "Magnus Carlsen",
        username: "magnuscarlsen",
        avatar: "https://avatars.githubusercontent.com/u/1?v=4"
      },
      blackPlayer: {
        name: "Hikaru Nakamura",
        username: "hikaru",
        avatar: "https://avatars.githubusercontent.com/u/2?v=4"
      },
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Position initiale
    },
    {
      id: 2,
      whitePlayer: {
        name: "Fabiano Caruana",
        username: "fabianocaruana",
        avatar: "https://avatars.githubusercontent.com/u/3?v=4"
      },
      blackPlayer: {
        name: "Ding Liren",
        username: "dingliren",
        avatar: "https://avatars.githubusercontent.com/u/4?v=4"
      },
      fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", // Position après e4
    },
    {
      id: 3,
      whitePlayer: {
        name: "Alireza Firouzja",
        username: "alireza",
        avatar: "https://avatars.githubusercontent.com/u/5?v=4"
      },
      blackPlayer: {
        name: "Wesley So",
        username: "wesleyso",
        avatar: "https://avatars.githubusercontent.com/u/6?v=4"
      },
      fen: "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1", // Position après Nf3
    },
  ],
  // Deuxième ligne
  [
    {
      id: 4,
      whitePlayer: {
        name: "Levon Aronian",
        username: "levonaronian",
        avatar: "https://avatars.githubusercontent.com/u/7?v=4"
      },
      blackPlayer: {
        name: "Anish Giri",
        username: "anishgiri",
        avatar: "https://avatars.githubusercontent.com/u/8?v=4"
      },
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Position initiale
    },
    {
      id: 5,
      whitePlayer: {
        name: "Ian Nepomniachtchi",
        username: "iannepo",
        avatar: "https://avatars.githubusercontent.com/u/9?v=4"
      },
      blackPlayer: {
        name: "Shakhriyar Mamedyarov",
        username: "shakh",
        avatar: "https://avatars.githubusercontent.com/u/10?v=4"
      },
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Position initiale
    },
    {
      id: 6,
      whitePlayer: {
        name: "Viswanathan Anand",
        username: "vishyanand",
        avatar: "https://avatars.githubusercontent.com/u/11?v=4"
      },
      blackPlayer: {
        name: "Maxime Vachier-Lagrave",
        username: "mvachier",
        avatar: "https://avatars.githubusercontent.com/u/12?v=4"
      },
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Position initiale
    },
  ],
];

export default function CurrentGames() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Quelques parties en cours</h1>
      
      {currentGames.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {row.map((game) => (
            <Card key={game.id} className="overflow-hidden">
              <CardHeader className="p-2">
                <CardTitle className="text-sm font-medium text-center">
                  <div className="grid place-items-center gap-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={game.blackPlayer.avatar} alt={game.blackPlayer.name} />
                      <AvatarFallback>{game.blackPlayer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Badge className="bg-[#27272a] text-[white] px-3 py-1">
                    <div className="font-bold">{game.blackPlayer.name}</div>
                    <div className="text-sm text-gray-200">@{game.blackPlayer.username}</div>
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex justify-center items-center">
                <div className="aspect-square ">
                  <Chessboard 
                    position={game.fen} 
                    boardWidth={300}
                    arePiecesDraggable={false}
                    customBoardStyle={{
                      borderRadius: "4px",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                </div>
              </CardContent>
              <div className="p-2">
                <div className="grid place-items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={game.whitePlayer.avatar} alt={game.whitePlayer.name} />
                    <AvatarFallback>{game.whitePlayer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <Badge className="bg-[white] text-[#27272a] border-[#27272a] px-3 py-1">
                  <div className="font-bold">{game.whitePlayer.name}</div>
                  <div className="text-sm text-gray-500">@{game.whitePlayer.username}</div>
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
} 