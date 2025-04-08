// src/app/community/page.tsx

import React, { ReactElement } from "react";
import HeroSection from "../components/global/hero-section";
import Features from "@/components/global/features";
import Leaderboard from "@/components/global/bestplayers/bestplayers";
import LastGames from "@/components/global/lastgames/lastgames";

export const metadata = {
  title: "Communauté | PlayChess",
  description: "Rejoignez la communauté PlayChess pour échanger et progresser aux échecs.",
};

export default function Page(): ReactElement {
  return (
    <div>
      <main>
        <HeroSection />
        <Features />
        <Leaderboard />
        <LastGames />
      </main>
      <footer></footer>
    </div>
  );
}