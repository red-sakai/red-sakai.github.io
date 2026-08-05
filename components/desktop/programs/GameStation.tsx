"use client";

import { useState } from "react";

interface Game {
  id: string;
  title: string;
  year: string;
  src: string;
}

const GAMES: Game[] = [
  {
    id: "vice-city",
    title: "GTA: Vice City",
    year: "2002",
    src: "https://vc.quenq.com",
  },
  {
    id: "doom",
    title: "DOOM (Shareware)",
    year: "1993",
    src: "https://archive.org/embed/doom_dos",
  },
  {
    id: "prince-of-persia",
    title: "Prince of Persia",
    year: "1990",
    src: "https://archive.org/embed/msdos_Prince_of_Persia_1990",
  },
  {
    id: "wolfenstein-3d",
    title: "Wolfenstein 3D",
    year: "1992",
    src: "https://archive.org/embed/msdos_Wolfenstein_3D_1992",
  },
  {
    id: "pac-man",
    title: "Pac-Man",
    year: "1983",
    src: "https://archive.org/embed/msdos_Pac-Man_1983",
  },
  {
    id: "jazz-jackrabbit",
    title: "Jazz Jackrabbit",
    year: "1994",
    src: "https://archive.org/embed/msdos_Jazz_Jackrabbit_1994",
  },
];

export default function GameStation() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  if (selectedGame) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ padding: "4px 8px", background: "#c0c0c0", borderBottom: "1px solid #808080", display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setSelectedGame(null)}
            style={{
              background: "#c0c0c0",
              borderTop: "2px solid #fff",
              borderLeft: "2px solid #fff",
              borderRight: "2px solid #808080",
              borderBottom: "2px solid #808080",
              outline: "1px solid #000",
              padding: "2px 6px",
              fontSize: 11,
              cursor: "pointer",
              color: "#000",
              fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif',
            }}
          >
            ← Back
          </button>
          <span style={{ fontSize: 11 }}>{selectedGame.title}</span>
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <iframe
            src={selectedGame.src}
            style={{ width: "100%", height: "100%", border: "none" }}
            allowFullScreen
            title={selectedGame.title}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 8 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#000", fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif' }}>
        Game Station
      </div>
      <div style={{ fontSize: 11, marginBottom: 12, color: "#666", fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif' }}>
        Select a game to play in your browser.
      </div>
      {GAMES.map((game) => (
        <button
          key={game.id}
          onClick={() => setSelectedGame(game)}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "6px 8px",
            background: "#c0c0c0",
            borderTop: "2px solid #fff",
            borderLeft: "2px solid #fff",
            borderRight: "2px solid #808080",
            borderBottom: "2px solid #808080",
            outline: "1px solid #000",
            marginBottom: 4,
            cursor: "pointer",
            fontSize: 11,
            color: "#000",
            fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif',
          }}
        >
          <span style={{ fontWeight: 700 }}>{game.title}</span>
          <span style={{ marginLeft: 8, color: "#666" }}>({game.year})</span>
        </button>
      ))}
    </div>
  );
}
