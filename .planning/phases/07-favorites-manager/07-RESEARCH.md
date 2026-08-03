# Phase 7: Favorites Manager — Research

**Researched:** 2026-07-26
**Domain:** CRUD operations, localStorage persistence, Win98 modal forms, React context for cross-phase admin state
**Confidence:** HIGH

## Summary

This phase upgrades the existing read-only "My Favorites" program into a full CRUD interface. Favorites are stored in localStorage (no JSON file editing). Editing is gated behind admin mode, which is auto-detected from the Phase 6 login screen when a secret password is entered.

The primary technical challenges are: (1) establishing a cross-phase admin state mechanism between Phase 6 (LoginModal) and Phase 7 (Favorites), (2) converting the existing static JSON import to a dynamic localStorage-backed state with the 2-part useEffect pattern, (3) building Win98-style modal forms (Add/Edit/Delete) that match the existing detail modal aesthetic, and (4) ensuring stable IDs for CRUD operations.

**Primary recommendation:** React Context (`AdminContext`) for admin state passing — simplest mechanism, zero new dependencies, matches codebase patterns. Add a stable `id` field to `FavoriteEntry` (use `crypto.randomUUID()`). Follow the established localStorage 2-part useEffect pattern (hydration + persist). Build three Win98 modal dialogs reusing existing CSS classes.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Favorites data persistence | Browser / Client (localStorage) | — | All state is local — no server or API involved |
| Admin state detection | Browser / Client (React Context) | — | LoginModal checks password; sets context flag |
| Admin state consumption | Browser / Client (React Context) | — | Favorites program reads `isAdmin` from context |
| CRUD operations | Browser / Client | — | All operations modify in-memory state + persist to localStorage |
| Win98 modal dialogs | Browser / Client | — | Pure CSS/React overlays — no external modal library |
| Image display | Browser / Client (URL-based) | — | URL input only; gradient fallback already exists |

## User Constraints (from CONTEXT.md)

<user_constraints>

### Locked Decisions

#### Persistence Strategy
- **D-01:** Favorites stored in localStorage only (same pattern as wallpapers, color scheme, settings)
- **D-02:** Start empty — no migration from `data/favorites.json`. Existing JSON file is not used at runtime
- **D-03:** The existing `data/favorites.json` file can be removed or kept as a reference seed (not loaded by the app)

#### Admin Mode (Cross-Phase with Phase 6)
- **D-04:** Admin mode auto-detected from the Login screen (Phase 6). Entering a specific secret password at login grants session-wide admin privileges
- **D-05:** Admin mode persists for the session (page refresh resets it). No per-action re-authentication
- **D-06:** When not in admin mode, the Favorites program is read-only (current behavior). When in admin mode, Add/Edit/Delete controls appear
- **D-07:** Phase 6 must be updated to expose an admin state (e.g., React context or global state) that Phase 7 reads. This is a cross-phase dependency

#### Edit UI Pattern
- **D-08:** Add/Edit forms use Win98-style modal dialogs (same visual pattern as the existing detail modal — raised borders, titlebar, OK/Cancel buttons)
- **D-09:** All fields editable: title, category (dropdown: anime/manhwa/game), rating (0-10 input), thoughts (textarea), image (URL)
- **D-10:** Delete confirmation dialog before removing an entry (Win98-style)

#### Image Handling
- **D-11:** URL input only. User pastes an image URL. No file upload or base64 conversion
- **D-12:** When no image URL is provided, the gradient + emoji fallback is shown (already implemented)

#### Desktop Registration
- **D-13:** Reuse existing "My Favorites" icon + program entry in `DESKTOP_ICONS` and `programList`. No new registration needed
- **D-14:** The existing `WindowState.component` union type already includes `"favorites"` — no type changes needed

### the agent's Discretion
- Admin state passing mechanism between Phase 6 and Phase 7 (React context, zustand, or a simple global variable — agent chooses based on codebase simplicity)
- Visual layout of the admin toolbar (Add button, Edit/Delete on hover/click within the grid)
- Password validation behavior (exact match, case sensitivity)

### Deferred Ideas (OUT OF SCOPE)
- Data export/import (download JSON)
- Dynamic categories (custom categories beyond anime/manhwa/game)
- Image file upload / base64 storage
- Seed migration from `data/favorites.json`

</user_constraints>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FAV-01 | Upgrade existing read-only Favorites to full CRUD via Win98-style dialogs | UI-SPEC.md defines AddEditModal, DeleteConfirmModal, AdminToolbar components |
| FAV-02 | Favorites persisted in localStorage (not JSON files) | localStorage 2-part useEffect pattern verified from DesktopShell.tsx |
| FAV-03 | Category filtering works for all operations (add/edit within current filter context) | Existing FilterBar pattern preserved; data array updates trigger re-filter |
| FAV-04 | Admin mode gates editing behind secret password at login | AdminContext + LoginModal password detection approach documented below |
| FAV-05 | `npm run build` succeeds with zero errors | Static export compatible — no server-side data dependency |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React `useState` / `useEffect` | 19.2.3 | CRUD state, modal visibility, localStorage hydration/persist | Existing codebase pattern |
| React `useContext` / `createContext` | 19.2.3 | Cross-phase admin state passing | Simplest mechanism, zero new deps, matches codebase |
| `crypto.randomUUID()` | Web API | Stable ID generation for CRUD entries | Browser-native, no dependency needed |
| Win98 CSS classes | — | All modal dialogs, buttons, fields, titlebars | `win98-window`, `win98-titlebar`, `win98-title-btn`, `win98-field` already exist in `desktop.css` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `clsx` / `tailwind-merge` | ^2.1.1 / ^3.4.0 | Conditional class joining | Existing codebase utility (`cn()`) — not needed in desktop components since they use inline styles, not Tailwind |

### Installation
**No new packages required.** This phase uses only existing React primitives and browser APIs.

## Package Legitimacy Audit

> **No external packages are installed in this phase.** The phase is purely React component code using existing dependencies and browser APIs (`crypto.randomUUID`, `localStorage`). No audit required.

## Architecture Patterns

### System Architecture Diagram

```
Login Screen (Phase 6)
  ┌──────────────────────────────┐
  │  LoginModal.tsx              │
  │  Password: [secret]          │
  │  → checks ADMIN_SECRET       │
  │  → calls setAdmin(true)      │
  └──────────┬───────────────────┘
             │ password matches ADMIN_SECRET?
             ├── YES → setAdmin(true)
             └── NO  → setAdmin(false) (default)
             │
             ▼
  AdminContext (NEW: AdminContext.tsx)
  ┌──────────────────────────────┐
  │  isAdmin: boolean            │
  │  setAdmin: (v) => void       │
  │  ADMIN_SECRET: "jhered"      │
  └──────────┬───────────────────┘
             │
             ▼
  DesktopShell wraps content in <AdminProvider>
             │
             ├──────────────────────────────┐
             │                              │
             ▼                              ▼
  Favorites.tsx (Phase 7)        (Future admin-gated features)
  ┌──────────────────────────┐
  │ useAdmin() → isAdmin     │
  │                          │
  │ [isAdmin = false]        │  [isAdmin = true]
  │ ┌──────────────────────┐ │  ┌──────────────────────────────┐
  │ │ Read-only grid      │ │  │ [+ Add Favorite] toolbar     │
  │ │ Detail modal only   │ │  │ Cards show ✏️ 🗑️ icons     │
  │ └──────────────────────┘ │  │ AddEditModal / DeleteConfirm │
  └──────────────────────────┘  └──────────────────────────────┘
             │
             ▼
  localStorage ("favorites" key)
  ┌──────────────────────────────┐
  │  FavoriteEntry[]             │
  │  Hydration: useEffect on     │
  │    mount reads from store    │
  │  Persist: useEffect on       │
  │    state change writes store │
  └──────────────────────────────┘
```

### Data Flow for Add Operation
```
User clicks [+ Add Favorite]
  → AdminToolbar shown (isAdmin === true)
  → AddEditModal opens (empty fields)
  → User fills form, clicks OK
  → Client-side validation: title required
  → New entry created with crypto.randomUUID() id
  → favorites state updated (spread [...prev, newEntry])
  → Persist effect writes to localStorage
  → Grid re-renders with new entry
  → Modal closes
```

### Data Flow for Edit Operation
```
User clicks ✏️ on card
  → AddEditModal opens (pre-filled)
  → User modifies fields, clicks OK
  → favorites state updated (map, find by id)
  → Persist effect writes to localStorage
  → Grid re-renders
  → If detail modal open for this entry, update in real-time
```

### Data Flow for Delete Operation
```
User clicks 🗑️ on card
  → DeleteConfirmModal opens ("Are you sure?")
  → User clicks "Yes"
  → favorites state updated (filter by id)
  → Persist effect writes to localStorage
  → If detail modal open, close it
  → Grid re-renders
```

### AdminContext Architecture

```typescript
// NEW: components/desktop/AdminContext.tsx

import { createContext, useContext, useState, type ReactNode } from "react";

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

**Key design decisions:**
- `ADMIN_SECRET` defined as exported constant in AdminContext.tsx — single source of truth
- Case-sensitive exact match (agent's discretion — choosing strict matching for security predictability)
- `AdminProvider` wraps all DesktopShell content including login modal
- `useAdmin()` hook provides clean consumer API

### localStorage Data Schema

```typescript
interface FavoriteEntry {
  id: string;           // crypto.randomUUID() — stable for CRUD
  title: string;        // Required
  category: "game" | "manhwa" | "anime";
  image: string;        // URL string, "" = gradient fallback
  rating: number;       // 0–10 float, stored as parsed float
  thoughts: string;     // Free text, "" = "No thoughts recorded."
}

// localStorage key: "favorites"
// Value: JSON.stringify(FavoriteEntry[])
```

**Why `crypto.randomUUID()` over timestamp:** Timestamp-based IDs can collide under rapid adds (unlikely but possible). `crypto.randomUUID()` is browser-native (available in all modern browsers including Chrome 49+, Firefox 43+, Safari 15.4+, Edge 12+), generates UUID v4 with 122 random bits, and requires no dependency.

### Persistence Pattern (2-part useEffect)

```typescript
// Part 1: Hydration — runs once on mount
const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);

useEffect(() => {
  try {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      const parsed = JSON.parse(stored) as FavoriteEntry[];
      setFavorites(parsed);
    }
    // No stored data → start with empty array [] (D-02)
  } catch {
    setFavorites([]); // Graceful fallback on corrupt data
  }
}, []);

// Part 2: Persist — runs when favorites state changes
useEffect(() => {
  try {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  } catch {
    // Quota exceeded or write failure — show error state
    // Copy: "Could not save favorites. Storage may be full."
  }
}, [favorites]);
```

**Source:** Verified from DesktopShell.tsx — exact same 2-part pattern (hydration effect lines 113-142, persist effects lines 145-179). This is the established codebase standard.

### Modal Dialog Pattern (Reusable)

All three modals (AddEditModal, DeleteConfirmModal, DetailModal) share the same Win98 overlay structure:

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
      <span>Modal Title</span>
      <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
        <button className="win98-title-btn" onClick={closeModal}>✕</button>
      </div>
    </div>
    <div style={{ padding: 14, color: "#000", fontSize: 11 }}>
      {/* modal content */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button className="win98-title-btn" style={{ padding: "4px 16px" }}>OK</button>
        <button className="win98-title-btn" style={{ padding: "4px 16px" }}>Cancel</button>
      </div>
    </div>
  </div>
</div>
```

**Source:** Verified from existing Favorites.tsx detail modal (lines 166-251) and DesktopShell.tsx Shut Down dialog (lines 403-422). Both use identical overlay + win98-window + titlebar + button pattern.

### Idempotent Re-renders on Edit/Delete

When editing or deleting while the detail modal is open for the same entry:

```typescript
// In the Edit handler: after updating, check if detail modal shows this entry
const handleEdit = useCallback((updated: FavoriteEntry) => {
  setFavorites(prev => prev.map(f => f.id === updated.id ? updated : f));
  // If detail modal is showing this entry, selected state still holds ref
  // React re-render preserves the object reference — detail modal auto-updates
}, []);

// In the Delete handler: close detail modal if showing deleted entry
const handleDelete = useCallback((id: string) => {
  setFavorites(prev => prev.filter(f => f.id !== id));
  setSelected(prev => prev?.id === id ? null : prev); // Close detail modal
}, []);
```

### Recommended Project Structure

```
components/desktop/
├── AdminContext.tsx          # NEW — AdminProvider + useAdmin hook + ADMIN_SECRET
├── DesktopShell.tsx          # MODIFY — wrap content in AdminProvider
├── LoginModal.tsx            # MODIFY — import ADMIN_SECRET, call setAdmin on match
├── programs/
│   └── Favorites.tsx         # MODIFY — full CRUD rewrite with localStorage
│   └── ... (unchanged)
└── ... (unchanged)
```

### Pattern 1: Win98 Modal Form (Add/Edit)
**What:** A form inside a Win98 window overlay for adding or editing a favorite entry.
**When to use:** Both Add flow and Edit flow use the same modal component with different initial data.

**Example structure:**
```typescript
function AddEditModal({
  initial,
  onSave,
  onCancel,
}: {
  initial?: FavoriteEntry;           // undefined = Add mode, defined = Edit mode
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
    // Win98 overlay with form fields (see UI-SPEC.md for layout)
    // Form fields: Title (text), Category (select), Rating (number 0-10),
    //   Image URL (text), Thoughts (textarea)
    // Buttons: OK (calls handleSubmit), Cancel (calls onCancel)
  );
}
```

### Pattern 2: Admin Toolbar + Per-Item Icons
**What:** Conditional UI elements that appear only when `isAdmin === true`.
**When to use:** Always in admin mode.

```typescript
function AdminToolbar({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <button onClick={onAdd} style={win98Btn}>
        + Add Favorite
      </button>
    </div>
  );
}

// Inside the card render (in admin mode):
{isAdmin && (
  <div style={{ position: "absolute", top: 2, right: 2, display: "flex", gap: 2 }}>
    <button
      aria-label={`Edit ${entry.title}`}
      onClick={(e) => { e.stopPropagation(); onEdit(entry); }}
      style={miniBtnStyle}
    >✏️</button>
    <button
      aria-label={`Delete ${entry.title}`}
      onClick={(e) => { e.stopPropagation(); onDelete(entry); }}
      style={miniBtnStyle}
    >🗑️</button>
  </div>
)}
```

### Anti-Patterns to Avoid
- **Array index as key:** When favorites can be edited/deleted, array indices shift. Use the `id` field for React keys and CRUD operations.
- **Direct mutation of state:** Always use immutable updates (`map`, `filter`, spread) for the favorites array.
- **Persist effect before hydration completes:** Without a `hydrated` guard, the persist effect may write stale `[]` on first mount. See localStorage pattern above for the safe approach.
- **Storing the admin password in plain view:** The admin secret is a cosmetic easter-egg feature, not real auth. Hardcoding it in `AdminContext.tsx` is acceptable for this use case.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal overlay | Custom overlay from scratch | Reuse existing Win98 overlay pattern (Favorites.tsx lines 166-177, DesktopShell.tsx lines 403-422) | Three modals share the same structure — reusable pattern saves ~30 lines each |
| Sunken input fields | Custom CSS | `.win98-field` class (already in desktop.css from Phase 6) | Matches Win98 aesthetic, already implemented |
| 3D button styles | Custom CSS | `win98-title-btn` class | Already defined in desktop.css with correct raised/sunken states |
| Admin state management | zustand, redux, or global variable | React Context (`AdminContext`) | Zero deps, matches codebase simplicity, sufficient for single-boolean state |
| ID generation | Counter, timestamp, nanoid | `crypto.randomUUID()` | Browser-native, collision-free, no dependency |

**Key insight:** Every UI pattern needed for this phase already exists in the codebase. The Win98 overlay pattern, button/titlebar CSS classes, and localStorage persistence pattern are all established. Zero new UI libraries needed.

## Common Pitfalls

### Pitfall 1: localStorage Race Condition (Hydration vs. Persist)
**What goes wrong:** On page load, the persist useEffect fires before hydration completes, writing `[]` (empty initial state) to localStorage — potentially overwriting existing saved data.
**Why it happens:** Both effects mount in the same render cycle. The persist effect runs with the initial `useState([])` value before the hydration effect has a chance to call `setFavorites(parsed)`.
**How to avoid:** Use a `hydrated` boolean flag guarded by a separate `useEffect`:
```typescript
const [hydrated, setHydrated] = useState(false);

// Hydration effect
useEffect(() => {
  try {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  } catch { /* ignore */ }
  setHydrated(true);
}, []);

// Persist effect — guarded
useEffect(() => {
  if (!hydrated) return;
  try { localStorage.setItem("favorites", JSON.stringify(favorites)); }
  catch { /* handle quota error */ }
}, [favorites, hydrated]);
```
**Warning signs:** On page refresh, favorites list appears empty even though data was previously saved.

### Pitfall 2: Detail Modal Shows Stale Data After Edit
**What goes wrong:** User edits a favorite while the detail modal is open. The detail modal still shows old data.
**Why it happens:** The `selected` state holds a reference to the old entry object. After edit, the favorites array has a new object (immutable update), but `selected` still points to the old one.
**How to avoid:** When editing, find the updated entry in the favorites array and update `selected`:
```typescript
const handleEdit = (updated: FavoriteEntry) => {
  setFavorites(prev => prev.map(f => f.id === updated.id ? updated : f));
  setSelected(prev => prev?.id === updated.id ? updated : prev); // Sync detail modal
};
```
**Warning signs:** Detail modal shows old rating/thoughts after edit.

### Pitfall 3: Delete While Detail Modal Is Open
**What goes wrong:** User deletes a favorite while the detail modal is open for that entry. The detail modal remains visible showing a now-deleted entry.
**Why it happens:** The `selected` state still holds the deleted entry's reference.
**How to avoid:** On delete, check if `selected` matches the deleted entry and close the modal:
```typescript
const handleDelete = (id: string) => {
  setFavorites(prev => prev.filter(f => f.id !== id));
  setSelected(prev => prev?.id === id ? null : prev);
};
```
**Warning signs:** Detail modal shows "deleted" data after deletion.

### Pitfall 4: Admin State Not Persisting After Login Animation
**What goes wrong:** The current DesktopShell's `handleLoginSuccess` has a 3.2-second animation delay. If `setAdmin(true)` is called inside LoginModal during form submit, but DesktopShell re-renders during the animation, the admin state might be lost.
**Why it happens:** The admin state (in DesktopShell or AdminContext) is set synchronously by LoginModal's submit handler. But the current login flow uses `handleLoginSuccess` → `setLoginAnimating(true)` → setTimeout → `setShowLogin(false)`. If the AdminProvider is inside an early-return block, it might unmount.
**How to avoid:** The `AdminProvider` must wrap the ENTIRE return of DesktopShell — including the login gate. This ensures the context value persists through the login → boot → desktop transition.
**Warning signs:** Admin mode works immediately after login but resets after the boot animation.

### Pitfall 5: Missing `type="button"` on Cancel Buttons in Forms
**What goes wrong:** Cancel buttons inside `<form>` elements trigger form submission instead of just closing the modal.
**Why it happens:** Default `type` for `<button>` inside `<form>` is `"submit"`.
**How to avoid:** Set Cancel/No buttons to `type="button"` explicitly. OK/Yes buttons should be `type="submit"` or use `onClick` with manual validation.
**Warning signs:** Cancel closes modal AND performs the add/edit action.

## Code Examples

### Example 1: Favorites.tsx Hydration + Persist + Admin Detection

```typescript
"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../AdminContext";
// Remove: import favorites from "@/data/favorites.json";

interface FavoriteEntry {
  id: string;
  title: string;
  category: string;
  image: string;
  rating: number;
  thoughts: string;
}

// ...categoryEmoji, categoryGradients, win98Sunken, win98Btn (unchanged)...
// ...FilterKey type (unchanged)...

export default function Favorites() {
  const { isAdmin } = useAdmin(); // NEW: cross-phase admin state
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selected, setSelected] = useState<FavoriteEntry | null>(null);

  // NEW: localStorage state
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Part 1: Hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem("favorites");
      if (stored) setFavorites(JSON.parse(stored) as FavoriteEntry[]);
    } catch {
      setFavorites([]);
    }
    setHydrated(true);
  }, []);

  // Part 2: Persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch {
      // Storage full — silently degrade
    }
  }, [favorites, hydrated]);

  // CRUD handlers
  const handleAdd = (entry: FavoriteEntry) => {
    setFavorites(prev => [...prev, entry]);
  };

  const handleEdit = (entry: FavoriteEntry) => {
    setFavorites(prev => prev.map(f => f.id === entry.id ? entry : f));
    setSelected(prev => prev?.id === entry.id ? entry : prev);
  };

  const handleDelete = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
    setSelected(prev => prev?.id === id ? null : prev);
  };

  // Filtered data
  const data = favorites; // Was: favorites as FavoriteEntry[] (from JSON import)
  const filtered = filter === "all"
    ? data
    : data.filter((f) => f.category === filter);

  // ... render (preserve grid, cards, detail modal)
  // ADD conditional admin toolbar + per-card edit/delete icons
}
```

### Example 2: AdminContext Integration in DesktopShell

```typescript
// In DesktopShell.tsx — add import
import { AdminProvider, useAdmin } from "./AdminContext";

// In the return statement — wrap everything in AdminProvider
return (
  <AdminProvider>
    {/* login gate, boot gate, desktop content all inside */}
  </AdminProvider>
);
```

### Example 3: LoginModal Admin Detection

```typescript
// In LoginModal.tsx — add import
import { ADMIN_SECRET, useAdmin } from "./AdminContext";

// Inside LoginModal component:
const { setAdmin } = useAdmin();

const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  sounds.play("click");
  setAdmin(password === ADMIN_SECRET); // Check against admin secret
  try {
    const loginAudio = new Audio("/audio/windows_98_login.mp3");
    loginAudio.volume = 0.5;
    loginAudio.play().catch(() => {});
  } catch {}
  onSuccess();
};
```

CRITICAL: The `AdminProvider` must wrap the login modal. The current DesktopShell structure returns `<LoginModal>` from an early `if (showLogin)` gate. To make context accessible inside LoginModal, move the `AdminProvider` to wrap the ENTIRE return:

```typescript
return (
  <AdminProvider>
    {showLogin ? (
      <LoginModal /* props */ />
    ) : showBoot ? (
      // boot animation
    ) : (
      // desktop content
    )}
  </AdminProvider>
);
```

### Example 4: DeleteConfirmModal Pattern

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

### Example 5: AddEditModal Form Fields (Win98 Styled)

```typescript
// Form field pattern for AddEditModal:
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
  {validationError && (
    <span style={{ color: "#cc0000", fontSize: 10 }}>{validationError}</span>
  )}
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
      min="0"
      max="10"
      step="0.1"
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

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Read-only grid importing `favorites.json` | Full CRUD with localStorage persistence | This phase | Data editable through UI, survives page refresh |
| No admin concept | AdminContext with secret password | This phase + Phase 6 modification | Edit/Delete gated behind auth; LoginModal needs update |
| No stable entry IDs | `crypto.randomUUID()` per entry | This phase | Enables reliable Edit/Delete targeting |
| `key={i}` in grid map | `key={entry.id}` | This phase | Stable keys prevent React rendering bugs after mutations |
| Detail modal only | Three modal types (Detail, AddEdit, DeleteConfirm) | This phase | Shared modal pattern; AddEditModal reused for both Add and Edit |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `crypto.randomUUID()` is available in all browsers targeting this portfolio | Standard Stack | Falls back to `Date.now().toString(36) + Math.random().toString(36).slice(2)` — portfolio targets modern browsers so risk is LOW |
| A2 | No test framework exists (`nyquist_validation` enabled but AGENTS.md says "No test framework configured") | Validation Architecture | All validation is manual / build-based. No automated regression tests for CRUD behavior |
| A3 | Current DesktopShell boot sequence still uses `showBoot` + `biosLine` state | Architecture Patterns | Verified by reading DesktopShell.tsx — but Phase 6 plan modifies this. After Phase 6 execution, the boot effect depends on `[showLogin]` |
| A4 | Phase 6 has NOT been executed yet | Cross-Phase Dependency | STATE.md shows Phase 6 at 10% (context gathered). 06-01-PLAN.md exists but no SUMMARY.md. Both Phase 6 and Phase 7 will be planned/executed together |

## Open Questions

1. **Admin secret password value?**
   - What we know: Needs to be a secret word that triggers admin mode when entered at login
   - What's unclear: The specific value (agent's discretion) — suggesting `"jhered"` as default
   - Recommendation: Define `ADMIN_SECRET = "jhered"` in `AdminContext.tsx`. Can be changed easily. Case-sensitive exact match.

2. **Should `data/favorites.json` be deleted?**
   - What we know: D-02 says "no migration" and D-03 says "can be removed or kept"
   - What's unclear: Whether to delete the file or keep it as reference seed
   - Recommendation: Keep the file as reference seed (zero cost, no runtime impact). The import in Favorites.tsx will be removed, so it won't affect the build.

3. **How should the admin toolbar layout work on mobile?**
   - What we know: Desktop uses Win98 inline styles
   - What's unclear: Mobile responsiveness for admin toolbar (currently viewport < 768px uses full-width windows)
   - Recommendation: Use existing responsive patterns — the admin toolbar naturally flows within the existing card grid. No special mobile handling needed beyond the existing Win98 responsive CSS.

## Environment Availability

> No external dependencies. The phase uses only:
> - React `useState`, `useEffect`, `useContext`, `createContext` — built into existing React 19.2.3 dependency
> - `crypto.randomUUID()` — browser Web API
> - `localStorage` — browser Web API
> - `win98-*` CSS classes — already exist in `desktop.css`
> - Existing Favorites.tsx, DesktopShell.tsx, LoginModal.tsx — all already exist
>
> **No new tools, runtimes, services, or CLIs required.**

## Validation Architecture

`nyquist_validation` is enabled in `.planning/config.json` (`"nyquist_validation": true`).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None — no test framework configured |
| Config file | — |
| Quick run command | `npm run build` (type-check + static export) |
| Full suite command | `npm run lint && npm run build` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FAV-01 | CRUD operations via Win98 modals | Manual | `npm run dev` → open Favorites in admin mode | ❌ — no E2E |
| FAV-02 | Favorites persist in localStorage | Manual | Add entry → refresh → entry visible | ❌ — no E2E |
| FAV-03 | Category filtering works after CRUD ops | Manual | Add entry in "game" → filter shows it | ❌ — no E2E |
| FAV-04 | Admin mode gates edit/delete | Manual | Login with admin password → CRUD controls visible; without → read-only | ❌ — no E2E |
| FAV-05 | Build succeeds | Automated | `npm run build` | ❌ — Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run build` (static export must succeed)
- **Per wave merge:** `npm run lint && npm run build`
- **Phase gate:** Manual verification of all CRUD flows; `npm run build` green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] No test infrastructure exists — manual verification is the only option per AGENTS.md ("No test framework configured")
- [ ] Desktop components have zero test coverage — CRUD operations are interactive/visual features best verified manually
- [ ] Build verification (`npm run build`) must pass for all changes

## Security Domain

> `security_enforcement` is not explicitly set in config.json, defaulting to enabled. However, admin mode is a cosmetic easter-egg feature, not real authentication.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Admin mode is a cosmetic gate for an easter-egg page. The admin secret is hardcoded in client-side code (`AdminContext.tsx`). This is NOT real auth — it's a themed feature toggle. |
| V4 Access Control | No | "Admin" state is a single boolean in React Context. No protected resources or server-side enforcement needed. |
| V5 Input Validation | Yes | Title field has required validation on the client side. Rating uses native HTML5 `min`/`max` constraints. These are UX validations, not security controls. |

**Rationale:** Admin mode on this portfolio is purely cosmetic — it gates UI controls on a static portfolio page. The admin secret is visible in client-side JavaScript source. No real authentication boundary exists. Standard security controls for authentication/access control do not apply.

## Sources

### Primary (HIGH confidence — codebase inspection)
- `components/desktop/programs/Favorites.tsx` — Full source: current read-only implementation (254 lines), inline styles, detail modal pattern, filter buttons, card grid
- `components/desktop/DesktopShell.tsx` — localStorage 2-part useEffect pattern (lines 113-179), Shut Down dialog overlay (lines 403-422), login gate state (lines 214-219, 424-432), `handleLoginSuccess` animation pattern
- `components/desktop/LoginModal.tsx` — Current form handler pattern, Win98 dialog structure, props interface
- `components/desktop/desktop.css` — Complete CSS class inventory: `win98-window`, `win98-titlebar`, `win98-title-btn`, `win98-field`, `win98-tray`, all border color values
- `components/desktop/Window.tsx` — Window/titlebar pattern reference
- `hooks/useWindowManager.ts` — WindowState type: component union includes `"favorites"` (line 9)
- `.planning/phases/06-login-screen/06-01-PLAN.md` — Phase 6 plan: LoginModal implementation, DesktopShell integration, no admin state exposure yet
- `.planning/phases/07-favorites-manager/07-CONTEXT.md` — User decisions D-01 through D-14
- `.planning/phases/07-favorites-manager/07-UI-SPEC.md` — Full visual contract: spacing scale, typography, color, component inventory, copywriting contract, interaction flows, localStorage schema, admin state contract
- `.planning/codebase/CONVENTIONS.md` — Client component patterns, import order
- `.planning/codebase/STACK.md` — React 19.2.3, Next.js 16.1.1, no test framework
- `AGENTS.md` — Project rules, conventions, commit style

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified by reading all source files. Only React primitives + browser APIs needed.
- Architecture: HIGH — AdminContext pattern is straightforward React; localStorage pattern already established in codebase; CRUD patterns are standard React state management.
- Pitfalls: HIGH — race conditions, stale detail modal state, and form button types are well-understood patterns; each has a documented mitigation.
- CSS/UI: HIGH — all Win98 CSS classes verified from desktop.css; the detail modal in existing Favorites.tsx is an exact pattern to follow.

**Research date:** 2026-07-26
**Valid until:** N/A — codebase-specific research (not dependent on external library versions)
