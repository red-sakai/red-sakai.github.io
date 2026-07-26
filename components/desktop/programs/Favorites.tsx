"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../AdminContext";

type FavoriteEntry = {
  id: string;
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

function AddEditModal({
  initial,
  onSave,
  onCancel,
}: {
  initial?: FavoriteEntry;
  onSave: (entry: FavoriteEntry) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? "anime");
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [image, setImage] = useState(initial?.image ?? "");
  const [thoughts, setThoughts] = useState(initial?.thoughts ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!title.trim()) {
      setValidationError("Title is required.");
      return;
    }
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      title: title.trim(),
      category,
      image,
      rating: parseFloat(rating.toString()) || 0,
      thoughts,
    });
  };

  return (
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
      onClick={onCancel}
    >
      <div
        className="win98-window"
        style={{ width: 380, position: "relative", fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="win98-titlebar" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span>{initial ? "✏️ Edit Favorite" : "✚ Add Favorite"}</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
            <button className="win98-title-btn" onClick={onCancel} style={{ fontWeight: 700, lineHeight: 1, fontSize: 12 }}>✕</button>
          </div>
        </div>
        <div style={{ padding: 14, color: "#000", fontSize: 11 }}>
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="fav-title" style={{ display: "block", marginBottom: 2 }}>Title</label>
            <input
              id="fav-title"
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setValidationError(null); }}
              className="win98-field"
              style={{ width: "100%" }}
            />
            {validationError && (
              <span style={{ color: "#cc0000", fontSize: 10 }}>{validationError}</span>
            )}
          </div>
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="fav-category" style={{ display: "block", marginBottom: 2 }}>Category</label>
            <select
              id="fav-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="win98-field"
              style={{ width: "100%" }}
            >
              <option value="anime">Anime</option>
              <option value="manhwa">Manhwa</option>
              <option value="game">Game</option>
            </select>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="fav-rating" style={{ display: "block", marginBottom: 2 }}>Rating <span style={{ fontWeight: 400, color: "#666" }}>(0.0 – 10.0)</span></label>
            <input
              id="fav-rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value) || 0)}
              className="win98-field"
              style={{ width: 80 }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="fav-image" style={{ display: "block", marginBottom: 2 }}>Image URL</label>
            <input
              id="fav-image"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="win98-field"
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="fav-thoughts" style={{ display: "block", marginBottom: 2 }}>Thoughts</label>
            <textarea
              id="fav-thoughts"
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              className="win98-field"
              rows={3}
              style={{ width: "100%", resize: "none" }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={handleSubmit}
              className="win98-title-btn"
              style={{ padding: "4px 16px", fontSize: 11 }}
            >
              OK
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="win98-title-btn"
              style={{ padding: "4px 16px", fontSize: 11 }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  title,
  onConfirm,
  onCancel,
}: {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
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
      onClick={onCancel}
    >
      <div
        className="win98-window"
        style={{ width: 320, position: "relative", fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="win98-titlebar" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span>Confirm Delete</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
            <button className="win98-title-btn" onClick={onCancel} style={{ fontWeight: 700, lineHeight: 1, fontSize: 12 }}>✕</button>
          </div>
        </div>
        <div style={{ padding: 16, textAlign: "center", color: "#000", fontSize: 11 }}>
          <p>Are you sure you want to remove {title}?</p>
          <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center" }}>
            <button
              type="button"
              onClick={onConfirm}
              className="win98-title-btn"
              style={{ padding: "4px 16px", fontSize: 11 }}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="win98-title-btn"
              style={{ padding: "4px 16px", fontSize: 11 }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Favorites() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selected, setSelected] = useState<FavoriteEntry | null>(null);
  const { isAdmin } = useAdmin();
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FavoriteEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<FavoriteEntry | null>(null);

  const handleAdd = (entry: FavoriteEntry) => {
    setFavorites(prev => [...prev, entry]);
    setShowAddModal(false);
  };

  const handleEdit = (updated: FavoriteEntry) => {
    setFavorites(prev => prev.map(f => f.id === updated.id ? updated : f));
    setSelected(prev => prev?.id === updated.id ? updated : prev);
    setEditingEntry(null);
  };

  const handleDelete = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
    setSelected(prev => prev?.id === id ? null : prev);
    setDeletingEntry(null);
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("favorites");
      if (stored) {
        const parsed = JSON.parse(stored) as FavoriteEntry[];
        setFavorites(parsed);
      }
    } catch {
      setFavorites([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch {
      // Storage full — silently degrade
    }
  }, [favorites, hydrated]);

  const data = favorites;

  if (!hydrated) return null;

  const filtered = filter === "all"
    ? data
    : data.filter((f) => f.category === filter);

  return (
    <div style={{ padding: 8, fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif', height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#000" }}>
        ⭐ My Favorites{isAdmin ? " (Admin)" : ""}
      </div>

      {isAdmin ? (
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              ...win98Btn,
              padding: "4px 12px",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            + Add Favorite
          </button>
        </div>
      ) : null}
      <div style={{ fontSize: 11, marginBottom: 12, color: "#666" }}>
        {isAdmin ? "Click any cover to see details. Use ✏️ to edit, 🗑️ to delete." : "Click any cover to see details and thoughts."}
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
            {filter !== "all"
              ? "No favorites in this category."
              : isAdmin
                ? "No favorites yet. Click '+ Add Favorite' above to add your first entry."
                : "No favorites to display."}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
            {filtered.map((entry) => {
              const gradient = categoryGradients[entry.category] ?? "linear-gradient(135deg, #808080, #606060)";
              const emoji = categoryEmoji[entry.category] ?? "⭐";
              return (
                  <div
                    key={entry.id}
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
                      position: "relative",
                    }}
                  >
                    {isAdmin && (
                      <div style={{ position: "absolute", top: 2, right: 2, display: "flex", gap: 2 }}>
                        <button
                          aria-label={`Edit ${entry.title}`}
                          onClick={(e) => { e.stopPropagation(); setEditingEntry(entry); }}
                          style={{
                            ...win98Btn, width: 18, height: 18, padding: 0,
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
                          }}
                        >✏️</button>
                        <button
                          aria-label={`Delete ${entry.title}`}
                          onClick={(e) => { e.stopPropagation(); setDeletingEntry(entry); }}
                          style={{
                            ...win98Btn, width: 18, height: 18, padding: 0,
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
                          }}
                        >🗑️</button>
                      </div>
                    )}
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
                      <span style={{ color: "#999", fontStyle: "italic" }}>No thoughts recorded.</span>
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

      {showAddModal && (
        <AddEditModal
          onSave={handleAdd}
          onCancel={() => setShowAddModal(false)}
        />
      )}
      {editingEntry && (
        <AddEditModal
          initial={editingEntry}
          onSave={handleEdit}
          onCancel={() => setEditingEntry(null)}
        />
      )}
      {deletingEntry && (
        <DeleteConfirmModal
          title={deletingEntry.title}
          onConfirm={() => handleDelete(deletingEntry.id)}
          onCancel={() => setDeletingEntry(null)}
        />
      )}
    </div>
  );
}
