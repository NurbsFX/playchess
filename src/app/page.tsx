// src/app/community/page.tsx
"use client";

import React, { ReactElement } from "react";
import HeroSection from "../components/global/hero-section";
import Features from "@/components/global/features";
import Leaderboard from "@/components/global/bestplayers/bestplayers";
import LastGames from "@/components/global/lastgames/lastgames";
import CurrentGames from "@/components/global/currentgames";


export default function Page(): ReactElement {

  return (
    <div>
      <main>
        <HeroSection />
        <Features />
        <Leaderboard />
        <CurrentGames />
        <LastGames />
      </main>
      <footer></footer>
    </div>
  );
}