// src/app/community/page.tsx

import React, { ReactElement } from "react";
import Navbar from "../components/global/navbar";

export const metadata = {
  title: "Communauté | PlayChess",
  description: "Rejoignez la communauté PlayChess pour échanger et progresser aux échecs.",
};

export default function Page(): ReactElement {
  return (
    <div>
      <main>
        <Navbar />
      </main>
      <footer></footer>
    </div>
  );
}