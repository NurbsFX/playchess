"use client";

import React from "react";
import { Sword, Trophy, Brain } from "lucide-react";

const features = [
    {
        title: "Affrontez des adversaires",
        icon: <Sword className="h-10 w-10 text-[#6890C9]" />,
        description:
            "Choisissez librement vos adversaires selon votre niveau et vos préférences. Développez vos tactiques en jouant des parties adaptées à votre progression.",
    },
    {
        title: "Rejoignez des tournois",
        icon: <Trophy className="h-10 w-10 text-[#6890C9]" />,
        description:
            "Participez à des tournois en ligne organisés régulièrement. Défiez d'autres joueurs et grimpez dans les classements pour prouver votre maîtrise.",
    },
    {
        title: "Progressez avec l'IA",
        icon: <Brain className="h-10 w-10 text-[#6890C9]" />,
        description:
            "Entraînez-vous efficacement avec votre tuteur IA, qui analyse vos parties, corrige vos erreurs et vous propose des exercices sur mesure.",
    },
];

const Features = () => {
    return (
        <section className="py-20 px-6 md:px-20">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-[#27272A] dark:text-white">
                    Découvrez l&apos;expérience PlayChess
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
                    Développez vos compétences grâce à des outils innovants et une communauté engagée.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {features.map((feature) => (
                    <div key={feature.title} className="flex flex-col items-center text-center space-y-6">
                        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#EDEFF2] dark:bg-[#27272A]">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-[#27272A] dark:text-white">
                            {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;