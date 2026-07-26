# Phase 07: Favorites Manager — Pattern Map

**Mapped:** 2026-07-26
**Files analyzed:** 4 (1 new, 3 modified)
**Analogs found:** 3 / 4 (1 no-analog)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `components/desktop/AdminContext.tsx` | context/provider | event-driven | None (first React Context in project) | no-analog |
| `components/desktop/DesktopShell.tsx` | shell/layout | request-response | `components/desktop/DesktopShell.tsx` (self) | exact |
| `components/desktop/LoginModal.tsx` | component/form | request-response | `components/desktop/LoginModal.tsx` (self) | exact |
| `components/desktop/programs/Favorites.tsx` | component | CRUD | `components/desktop/programs/Favorites.tsx` (self) + `components/desktop/DesktopShell.tsx` (secondary — localStorage pattern) | exact + role-match |

## Pattern Assignments

### `components/desktop/AdminContext.tsx` (context/provider, event-driven)

**Analog:** None — no existing React Context pattern in codebase. Use RESEARCH.md example as blueprint.

**Imports pattern** (from RESEARCH.md §AdminContext Architecture):
```typescript
import { createContext, useContext, useState, type ReactNode } from "react";
```

**Core pattern** (RESEARCH.md lines 191-219 — no existing analog; use this as template):
```typescript
interface AdminContextValue {
  isAdmin: boolean;
  setAdmin: (value: boolean) => void;
}

const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  setAdmin: () => {},
});

export const ADMIN_SECRET = "jhered"; // Exact match, case-sensitive

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setAdmin] = useState(false);
  return (
    <AdminContext.Provider value={{ isAdmin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
```

**File conventions to follow** — match existing hook structure from `useDesktopSounds.ts` (lines 1-3):
```typescript
"use client";

import { ... } from "react";
```

---

### `components/desktop/DesktopShell.tsx` (shell/layout, request-response)

**Analog:** Self — modifying existing file to wrap content in `AdminProvider`.

**Imports to add** (after line 19, matching existing import pattern):
```typescript
import { AdminProvider } from "./AdminContext";
```

**Core modification — wrap entire return in AdminProvider** (pattern at lines 326-434):
Current structure (lines 326-434):
```typescript
return (
  <main ...>
    {ctxMenu && (...)}
    <div style={{...}}>{/* desktop icons */}</div>
    <Taskbar ... />
    {startOpen && <StartMenu ... />}
    {windows.filter(...).map(...) => <WindowShell>...</WindowShell>}
    {showShutDownDialog && (...)}
    {showLogin && (
      <div className={`login-overlay${loginAnimating ? " overlay-fade" : ""}`}>
        <LoginModal ... />
      </div>
    )}
  </main>
);
```

**Modified pattern** (AdminProvider wraps the ENTIRE return so LoginModal can access context):
```typescript
return (
  <AdminProvider>
    <main ...>
      {ctxMenu && (...)}
      <div style={{...}}>{/* desktop icons */}</div>
      <Taskbar ... />
      {startOpen && <StartMenu ... />}
      {windows.filter(...).map(...) => <WindowShell>...</WindowShell>}
      {showShutDownDialog && (...)}
      {showLogin && (
        <div className={`login-overlay${loginAnimating ? " overlay-fade" : ""}`}>
          <LoginModal ... />
        </div>
      )}
    </main>
  </AdminProvider>
);
```

**Important:** `AdminProvider` must wrap the entire return — including the login gate (lines 424-432) — so `LoginModal` has access to `useAdmin()` context. Per RESEARCH.md Pitfall 4 (lines 493-497): "The AdminProvider must wrap the ENTIRE return of DesktopShell — including the login gate."

---

### `components/desktop/LoginModal.tsx` (component/form, request-response)

**Analog:** Self — modifying existing file to detect admin password and call `setAdmin()`.

**Imports to add** (after line 4, matching existing import pattern):
```typescript
import { ADMIN_SECRET, useAdmin } from "./AdminContext";
```

**Hook to add** (after line 25, matching existing `useDesktopSounds()` pattern):
```typescript
const { setAdmin } = useAdmin();
```

**Form handler modification** (existing lines 27-36, add admin detection):
```typescript
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  sounds.play("click");
  setAdmin(password === ADMIN_SECRET);  // NEW: detect admin password
  try {
    const loginAudio = new Audio("/audio/windows_98_login.mp3");
    loginAudio.volume = 0.5;
    loginAudio.play().catch(() => {});
  } catch {}
  onSuccess();
};
```

**Key detail:** `setAdmin()` is called BEFORE `onSuccess()` — this ensures admin state is set before the login animation starts. Per RESEARCH.md §AdminContext Architecture (lines 222-226): Case-sensitive exact match, `ADMIN_SECRET` is exported from `AdminContext.tsx`.

---

### `components/desktop/programs/Favorites.tsx` (component, CRUD)

**Analog (Primary):** Self — existing file provides the full UI template (grid, filter buttons, detail modal, inline styles).
**Analog (Secondary):** `components/desktop/DesktopShell.tsx` — localStorage 2-part useEffect pattern (lines 113-179).

**Imports pattern** — replace existing import (lines 1-4):
**Before (lines 1-4):**
```typescript
"use client";

import { useState } from "react";
import favorites from "@/data/favorites.json";
```

**After:**
```typescript
"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../AdminContext";
```

**Type definition** — add `id` field (existing lines 6-12):
```typescript
type FavoriteEntry = {
  id: string;          // NEW: crypto.randomUUID() for stable CRUD
  title: string;
  category: string;
  image: string;
  rating: number;
  thoughts: string;
};
```

**State variables** — add localStorage + admin state (replace lines 50-52):
**Before (lines 50-52):**
```typescript
export default function Favorites() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selected, setSelected] = useState<FavoriteEntry | null>(null);
```

**After:**
```typescript
export default function Favorites() {
  const { isAdmin } = useAdmin();  // NEW: cross-phase admin state
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selected, setSelected] = useState<FavoriteEntry | null>(null);

  // NEW: localStorage state
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
```

**localStorage 2-part useEffect pattern** — copy from `DesktopShell.tsx` lines 113-142 (hydration) and 145-179 (persist):

**Part 1: Hydration** (analog: DesktopShell.tsx lines 113-142):
```typescript
// Hydration — runs once on mount
useEffect(() => {
  try {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      const parsed = JSON.parse(stored) as FavoriteEntry[];
      setFavorites(parsed);
    }
    // No stored data → start with empty array [] (D-02)
  } catch {
    setFavorites([]);  // Graceful fallback on corrupt data
  }
  setHydrated(true);
}, []);
```

**Part 2: Persist** (analog: DesktopShell.tsx lines 145-148):
```typescript
// Persist — runs when favorites state changes
useEffect(() => {
  if (!hydrated) return;  // Guard: don't write [] before hydration
  try {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  } catch {
    // Quota exceeded — silently degrade (matching DesktopShell.tsx line 147 pattern)
  }
}, [favorites, hydrated]);
```

**CRUD handlers pattern:**
```typescript
const handleAdd = (entry: FavoriteEntry) => {
  setFavorites(prev => [...prev, entry]);
};

const handleEdit = (entry: FavoriteEntry) => {
  setFavorites(prev => prev.map(f => f.id === entry.id ? entry : f));
  setSelected(prev => prev?.id === entry.id ? entry : prev);  // Sync detail modal
};

const handleDelete = (id: string) => {
  setFavorites(prev => prev.filter(f => f.id !== id));
  setSelected(prev => prev?.id === id ? null : prev);  // Close detail modal
};
```

**Data source** — replace static JSON import with state (existing line 54):
**Before (line 54):**
```typescript
const data = favorites as FavoriteEntry[];
```

**After:**
```typescript
const data = favorites;
```

**Admin toolbar** — add before filter buttons (after line 70, before existing `div` with filter buttons):
```typescript
{isAdmin && (
  <div style={{ marginBottom: 12 }}>
    <button
      onClick={() => { /* open add modal */ }}
      style={{ ...win98Btn, padding: "4px 12px", fontSize: 11 }}
    >
      + Add Favorite
    </button>
  </div>
)}
```

**Per-card admin icons** — add inside each card (around existing lines 97-161, after the card's `onClick` on line 99):
```typescript
{isAdmin && (
  <div style={{ position: "absolute", top: 2, right: 2, display: "flex", gap: 2 }}>
    <button
      aria-label={`Edit ${entry.title}`}
      onClick={(e) => { e.stopPropagation(); /* open edit modal */ }}
      style={{
        ...win98Btn, width: 18, height: 18, padding: 0,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
      }}
    >✏️</button>
    <button
      aria-label={`Delete ${entry.title}`}
      onClick={(e) => { e.stopPropagation(); /* open delete confirm */ }}
      style={{
        ...win98Btn, width: 18, height: 18, padding: 0,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
      }}
    >🗑️</button>
  </div>
)}
```

**Note:** Card needs `position: "relative"` for absolute-positioned admin icons (add to existing style on line 112):
```typescript
style={{
  // ... all existing styles ...
  position: "relative",  // ADD THIS
}}
```

**Detail modal stale data sync** — existing `selected` state (line 167-251) automatically updates because `handleEdit` syncs the selected entry (see CRUD handlers above). The `setSelected(prev => prev?.id === entry.id ? entry : prev)` pattern ensures the detail modal shows updated data.

**React key stability** — replace array index `i` with `entry.id` (existing line 93):
**Before:** `{filtered.map((entry, i) => {`
**After:** `{filtered.map((entry) => {`
**And on line 98:** `key={i}` → `key={entry.id}`

**AddEditModal pattern** (new inner component or inlined modal):
Follow existing detail modal overlay pattern (lines 166-251) for the Win98 overlay structure:
```typescript
<div style={{
  position: "fixed", inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 99999,
}} onClick={() => closeModal()}>
  <div
    className="win98-window"
    style={{ width: 380, position: "relative" }}
    onClick={(e) => e.stopPropagation()}
  >
    <div className="win98-titlebar" style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span>{initial ? "Edit" : "Add"} Favorite</span>
      <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
        <button className="win98-title-btn" onClick={onCancel}>✕</button>
      </div>
    </div>
    <div style={{ padding: 14, color: "#000", fontSize: 11 }}>
      {/* Form fields — see RESEARCH.md Example 5 (lines 677-755) */}
      {/* ... title, category, rating, image, thoughts inputs ... */}
      {/* Validation error display */}
      {validationError && (
        <span style={{ color: "#cc0000", fontSize: 10 }}>{validationError}</span>
      )}
      {/* OK / Cancel buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button className="win98-title-btn" style={{ padding: "4px 16px" }} onClick={handleSubmit}>OK</button>
        <button className="win98-title-btn" style={{ padding: "4px 16px" }} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
</div>
```

**Form fields pattern** (for AddEditModal, per RESEARCH.md Example 5 lines 677-755):
```typescript
<div style={{ marginBottom: 8 }}>
  <label style={{ display: "block", marginBottom: 2, fontSize: 11, color: "#000" }}>
    Title:
  </label>
  <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="win98-field"
    style={{ fontSize: 11 }}
  />
</div>

<div style={{ marginBottom: 8 }}>
  <label style={{ display: "block", marginBottom: 2, fontSize: 11, color: "#000" }}>
    Category:
  </label>
  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="win98-field"
    style={{ fontSize: 11 }}
  >
    <option value="anime">Anime</option>
    <option value="manhwa">Manhwa</option>
    <option value="game">Game</option>
  </select>
</div>

<div style={{ marginBottom: 8 }}>
  <label style={{ display: "block", marginBottom: 2, fontSize: 11, color: "#000" }}>
    Rating:
  </label>
  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
    <input
      type="number"
      min="0" max="10" step="0.1"
      value={rating}
      onChange={(e) => setRating(parseFloat(e.target.value) || 0)}
      className="win98-field"
      style={{ fontSize: 11, width: 60 }}
    />
    <span style={{ fontSize: 10, color: "#666" }}>(0.0 – 10.0)</span>
  </div>
</div>

<div style={{ marginBottom: 8 }}>
  <label style={{ display: "block", marginBottom: 2, fontSize: 11, color: "#000" }}>
    Image URL:
  </label>
  <input
    type="text"
    value={image}
    onChange={(e) => setImage(e.target.value)}
    className="win98-field"
    style={{ fontSize: 11 }}
    placeholder="https://example.com/image.jpg"
  />
</div>

<div style={{ marginBottom: 12 }}>
  <label style={{ display: "block", marginBottom: 2, fontSize: 11, color: "#000" }}>
    Thoughts:
  </label>
  <textarea
    value={thoughts}
    onChange={(e) => setThoughts(e.target.value)}
    className="win98-field"
    rows={3}
    style={{ fontSize: 11, resize: "none" }}
  />
</div>
```

**DeleteConfirmModal pattern** (per RESEARCH.md Example 4 lines 637-671):
```typescript
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
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 99999,
    }}>
      <div className="win98-window" style={{ width: 320, position: "relative" }}>
        <div className="win98-titlebar">
          <span>Confirm Delete</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
            <button className="win98-title-btn" onClick={onCancel} style={{ fontWeight: 700, lineHeight: 1, fontSize: 12 }}>✕</button>
          </div>
        </div>
        <div style={{ padding: 16, color: "#000", fontSize: 11, textAlign: "center" }}>
          <p>Are you sure you want to remove {title}?</p>
          <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center" }}>
            <button className="win98-title-btn" style={{ padding: "4px 16px" }} onClick={onConfirm}>Yes</button>
            <button className="win98-title-btn" style={{ padding: "4px 16px" }} onClick={onCancel}>No</button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Note on `type="button"`:** Cancel/No buttons must use `type="button"` when inside `<form>` elements to prevent form submission (per RESEARCH.md Pitfall 5 lines 498-502). In standalone modals (not wrapped in `<form>`), this is not needed — but for the AddEditModal which uses form fields, ensure Cancel button has `type="button"`.

---

## Shared Patterns

### localStorage 2-Part useEffect (Hydration + Persist)
**Source:** `components/desktop/DesktopShell.tsx` lines 113-148
**Apply to:** `components/desktop/programs/Favorites.tsx`

**Hydration (DesktopShell.tsx lines 113-142):**
```typescript
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
```

**Persist with guard (DesktopShell.tsx lines 145-148):**
```typescript
useEffect(() => {
  if (!hydrated) return;
  try {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  } catch {
    // Quota exceeded — silently degrade
  }
}, [favorites, hydrated]);
```

### Win98 Modal Overlay Pattern
**Source:** `components/desktop/programs/Favorites.tsx` lines 166-177 (detail modal)
**Apply to:** AddEditModal, DeleteConfirmModal, existing DetailModal

```typescript
<div style={{
  position: "fixed", inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 99999,
}} onClick={() => closeModal()}>
  <div
    className="win98-window"
    style={{ width: 380, position: "relative" }}
    onClick={(e) => e.stopPropagation()}
  >
    <div className="win98-titlebar" style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span>Title</span>
      <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
        <button className="win98-title-btn" onClick={closeModal}>✕</button>
      </div>
    </div>
    <div style={{ padding: 14, color: "#000", fontSize: 11 }}>
      {/* content */}
    </div>
  </div>
</div>
```

### Win98 CSS Classes Available
**Source:** `components/desktop/desktop.css`

| Class | Purpose | Applied To |
|-------|---------|-----------|
| `win98-window` | Window container with raised borders | All modals (detail, add/edit, delete confirm) |
| `win98-titlebar` | Blue gradient title bar | All modal titlebars |
| `win98-title-btn` | 3D raised button | All buttons in modals (OK, Cancel, Yes, No, ✕) |
| `win98-field` | Sunken input field | All form inputs (text, select, textarea, number) |

### Inline Style Objects
**Source:** `components/desktop/programs/Favorites.tsx` lines 26-46
**Apply to:** All buttons and containers in Favorites.tsx

```typescript
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
```

### Error Handling Pattern
**Source:** `components/desktop/DesktopShell.tsx` (localStorage try/catch with silent degrade)
**Apply to:** All localStorage operations in Favorites.tsx

```typescript
try {
  localStorage.setItem("favorites", JSON.stringify(favorites));
} catch {
  // Quota exceeded — silently degrade (matching DesktopShell.tsx line 147)
}
```

```typescript
try {
  const stored = localStorage.getItem("favorites");
  if (stored) setFavorites(JSON.parse(stored) as FavoriteEntry[]);
} catch {
  setFavorites([]);  // Graceful fallback on corrupt data
}
```

### ID Generation Pattern
**Source:** Web API `crypto.randomUUID()`
**Apply to:** `handleAdd` in Favorites.tsx

```typescript
const newEntry: FavoriteEntry = {
  id: crypto.randomUUID(),
  title: title.trim(),
  category,
  image,
  rating: parseFloat(rating.toString()) || 0,
  thoughts,
};
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `components/desktop/AdminContext.tsx` | context/provider | event-driven | No React Context (`createContext`/`useContext`) exists anywhere in the codebase. Use RESEARCH.md §AdminContext Architecture as the pattern template. Zero external dependencies — uses React built-ins only. |

## Metadata

**Analog search scope:** `components/desktop/`, `components/desktop/programs/`, `hooks/`, `lib/`
**Files scanned:** 12 (all desktop programs, DesktopShell, LoginModal, hooks, utils)
**Pattern extraction date:** 2026-07-26
