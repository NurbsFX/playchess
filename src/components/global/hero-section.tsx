"use client";

import React from "react";
import { Chessboard } from "react-chessboard";


const HeroSection = () => {
    return (
        <section className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-center gap-12 px-6 md:px-20 py-20">
            {/* Texte côté gauche */}
            <div className="flex flex-col items-start text-left space-y-6 max-w-lg">
                <h1 className="text-4xl md:text-6xl font-bold text-[#27272A] dark:text-white leading-tight">
                    Jouez. Apprenez. Progressez.
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                    Rejoignez PlayChess, la plateforme ultime pour perfectionner vos compétences aux échecs en ligne, apprendre de nouvelles stratégies et affronter des joueurs du monde entier.
                </p>
                <div className="flex gap-4 mt-4">
                    <a href="/play">
                        <button className="bg-[#6890C9] hover:bg-[#5678A8] text-white font-semibold py-3 px-6 rounded-lg transition">
                            Jouer maintenant
                        </button>
                    </a>
                    <a href="/learn">
                        <button className="bg-transparent border-2 border-[#6890C9] text-[#6890C9] hover:bg-[#6890C9] hover:text-white font-semibold py-3 px-6 rounded-lg transition">
                            Apprendre
                        </button>
                    </a>
                </div>
            </div>

            {/* Plateau d'échecs côté droit */}
            <div className="w-fit md:w-fit border-black border-2 ">
                <Chessboard
                    id="BasicBoard"
                    boardWidth={400}
                    position="start"
                    arePiecesDraggable
                    animationDuration={200}
                />
            </div>
        </section>
    );
};

export default HeroSection;