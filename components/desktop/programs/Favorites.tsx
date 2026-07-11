"use client";

import { useState } from "react";
import favorites from "@/data/favorites.json";

type FavoriteEntry = {
  title: string;
  category: string;
  image: string;
  rating: number;
  thoughts: string;
};

const categoryEmoji: Record<string, string> = {
  game: "🎮",
  manhwa: "📖",
  anime: "🎬",
};

const categoryGradients: Record<string, string> = {
  game: "linear-gradient(135deg, #6a0dad, #4a0080)",
  manhwa: "linear-gradient(135deg, #0d6b3e, #004a28)",
  anime: "linear-gradient(135deg, #a02040, #6a0020)",
};

const win98Sunken: Record<string, string> = {
  background: "#c0c0c0",
  borderTop: "2px solid #808080",
  borderLeft: "2px solid #808080",
  borderRight: "2px solid #fff",
  borderBottom: "2px solid #fff",
};

const win98Btn: Record<string, string | number> = {
  background: "#c0c0c0",
  borderTop: "2px solid #fff",
  borderLeft: "2px solid #fff",
  borderRight: "2px solid #808080",
  borderBottom: "2px solid #808080",
  outline: "1px solid #000",
  cursor: "pointer",
  color: "#000",
  fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif',
  padding: "4px 8px",
  fontSize: 11,
};

type FilterKey = "all" | "game" | "manhwa" | "anime";

export default function Favorites() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selected, setSelected] = useState<FavoriteEntry | null>(null);

  const data = favorites as FavoriteEntry[];

  const filtered = filter === "all"
    ? data
    : data.filter((f) => f.category === filter);

  return (
    <div style={{ padding: 8, fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif', height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#000" }}>
        ⭐ My Favorites
      </div>

      <div style={{ fontSize: 11, marginBottom: 12, color: "#666" }}>
        Click any cover to see details and thoughts.
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {(["all", "game", "manhwa", "anime"] as FilterKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              ...win98Btn,
              fontWeight: filter === key ? 700 : 400,
              background: filter === key ? "#dfdfdf" : "#c0c0c0",
            }}
          >
            {key === "all" ? "All" : `${categoryEmoji[key] ?? ""} ${key.charAt(0).toUpperCase() + key.slice(1)}`}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", ...win98Sunken, padding: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ fontSize: 11, color: "#666", textAlign: "center", padding: 24 }}>
            No favorites in this category.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
            {filtered.map((entry, i) => {
              const gradient = categoryGradients[entry.category] ?? "linear-gradient(135deg, #808080, #606060)";
              const emoji = categoryEmoji[entry.category] ?? "⭐";
              return (
                <div
                  key={i}
                  onClick={() => setSelected(entry)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "#c0c0c0",
                    borderTop: "2px solid #fff",
                    borderLeft: "2px solid #fff",
                    borderRight: "2px solid #808080",
                    borderBottom: "2px solid #808080",
                    outline: "1px solid #000",
                    padding: 6,
                    color: "#000",
                    cursor: "pointer",
                  }}
                >
                  {entry.image ? (
                    <img
                      src={entry.image}
                      alt={entry.title}
                      style={{
                        width: "100%",
                        aspectRatio: "2 / 3",
                        objectFit: "cover",
                        border: "1px solid #808080",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "2 / 3",
                        background: gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 42,
                        border: "1px solid #808080",
                      }}
                    >
                      {emoji}
                    </div>
                  )}
                  <div style={{ padding: "4px 2px 0" }}>
                    <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {entry.title}
                    </div>
                    <div style={{ fontSize: 10, color: "#666", marginBottom: 2 }}>
                      {emoji} {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <span style={{ color: "#808000", fontSize: 12 }}>★</span>
                      <span style={{ fontWeight: 700, fontSize: 11 }}>{entry.rating.toFixed(1)}</span>
                    </div>
                    {entry.thoughts && (
                      <div style={{ fontSize: 9, color: "#444", lineHeight: 1.3, marginTop: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {entry.thoughts}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            className="win98-window"
            style={{ width: 460, position: "relative", fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="win98-titlebar" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span>{categoryEmoji[selected.category] ?? "⭐"} {selected.title}</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
                <button className="win98-title-btn" onClick={() => setSelected(null)} style={{ fontWeight: 700, lineHeight: 1, fontSize: 12 }}>✕</button>
              </div>
            </div>
            <div style={{ padding: 14, color: "#000", fontSize: 11 }}>
              <div style={{ display: "flex", gap: 18, marginBottom: 16 }}>
                {selected.image ? (
                  <img
                    src={selected.image}
                    alt={selected.title}
                    style={{
                      width: 180,
                      aspectRatio: "2 / 3",
                      objectFit: "cover",
                      border: "2px solid #808080",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 180,
                      aspectRatio: "2 / 3",
                      background: categoryGradients[selected.category] ?? "linear-gradient(135deg, #808080, #606060)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 64,
                      border: "2px solid #808080",
                      flexShrink: 0,
                    }}
                  >
                    {categoryEmoji[selected.category] ?? "⭐"}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{selected.title}</div>
                    <div style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>
                      {categoryEmoji[selected.category]} {selected.category.charAt(0).toUpperCase() + selected.category.slice(1)}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
                      <span style={{ color: "#808000", fontSize: 20 }}>★</span>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{selected.rating.toFixed(1)}</span>
                      <span style={{ fontSize: 11, color: "#666" }}>/ 10</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, lineHeight: 1.5, color: "#333", ...win98Sunken, padding: "6px 8px", minHeight: 50 }}>
                    {selected.thoughts || (
                      <span style={{ color: "#999", fontStyle: "italic" }}>No thoughts yet. Edit <code style={{ fontSize: 10, background: "#e0e0e0", padding: "1px 3px" }}>app/data/favorites.json</code> to add your notes.</span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setSelected(null)}
                  style={{ ...win98Btn, padding: "4px 20px" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
