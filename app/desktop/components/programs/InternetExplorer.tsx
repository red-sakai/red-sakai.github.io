"use client";

import { useState, useRef, useCallback } from "react";

interface HistoryEntry {
  url: string;
  title?: string;
}

type NavAction = "back" | "forward" | "refresh" | "stop" | "home";

const btnStyle: React.CSSProperties = {
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
};

const disabledBtnStyle: React.CSSProperties = {
  ...btnStyle,
  color: "#808080",
  cursor: "default",
};

const sunkenInputStyle: React.CSSProperties = {
  flex: 1,
  padding: "2px 4px",
  fontSize: 11,
  fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif',
  borderTop: "2px solid #808080",
  borderLeft: "2px solid #808080",
  borderRight: "2px solid #fff",
  borderBottom: "2px solid #fff",
  outline: "none",
  color: "#000",
  background: "#fff",
};

const MENU_ITEMS = ["File", "Edit", "View", "Favorites", "Tools", "Help"];

export default function InternetExplorer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const historyIndexRef = useRef(0);
  const loadingRef = useRef(false);
  const [address, setAddress] = useState("");
  const [currentUrl, setCurrentUrl] = useState("about:blank");
  const [history, setHistory] = useState<HistoryEntry[]>([{ url: "about:blank" }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setHistoryIndexAndRef = useCallback((n: number | ((prev: number) => number)) => {
    if (typeof n === "function") {
      setHistoryIndex((prev) => {
        const next = n(prev);
        historyIndexRef.current = next;
        return next;
      });
    } else {
      historyIndexRef.current = n;
      setHistoryIndex(n);
    }
  }, []);

  function sanitizeUrl(input: string): string | null {
    const trimmed = input.trim();
    if (!trimmed || trimmed === "about:blank") return "about:blank";
    if (/^(javascript|data|file|vbscript):/i.test(trimmed)) return null;
    const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      new URL(url);
      return url;
    } catch {
      return null;
    }
  }

  const navigate = useCallback(
    (rawUrl: string) => {
      const url = sanitizeUrl(rawUrl);
      if (!url) return;
      clearTimer();
      const currentIdx = historyIndexRef.current;
      setAddress(url === "about:blank" ? "" : url);
      setCurrentUrl(url);
      setBlocked(false);
      setLoading(true);
      loadingRef.current = true;
      setHistory((prev) => [...prev.slice(0, currentIdx + 1), { url }]);
      setHistoryIndexAndRef((prev) => prev + 1);
      timerRef.current = setTimeout(() => {
        if (loadingRef.current) {
          setBlocked(true);
          setLoading(false);
        }
      }, 10000);
    },
    [clearTimer, setHistoryIndexAndRef],
  );

  const handleNav = useCallback(
    (action: NavAction) => {
      switch (action) {
        case "back": {
          const currentIdx = historyIndexRef.current;
          if (currentIdx > 0) {
            const idx = currentIdx - 1;
            setHistoryIndexAndRef(idx);
            const entry = history[idx];
            setCurrentUrl(entry.url);
            setAddress(entry.url === "about:blank" ? "" : entry.url);
            setBlocked(false);
            setLoading(true);
            loadingRef.current = true;
            clearTimer();
            timerRef.current = setTimeout(() => {
              if (loadingRef.current) {
                setBlocked(true);
                setLoading(false);
              }
            }, 10000);
          }
          break;
        }
        case "forward": {
          const currentIdx = historyIndexRef.current;
          if (currentIdx < history.length - 1) {
            const idx = currentIdx + 1;
            setHistoryIndexAndRef(idx);
            const entry = history[idx];
            setCurrentUrl(entry.url);
            setAddress(entry.url === "about:blank" ? "" : entry.url);
            setBlocked(false);
            setLoading(true);
            loadingRef.current = true;
            clearTimer();
            timerRef.current = setTimeout(() => {
              if (loadingRef.current) {
                setBlocked(true);
                setLoading(false);
              }
            }, 10000);
          }
          break;
        }
        case "refresh": {
          iframeRef.current?.contentWindow?.location.reload();
          clearTimer();
          setLoading(true);
          loadingRef.current = true;
          timerRef.current = setTimeout(() => {
            if (loadingRef.current) {
              setBlocked(true);
              setLoading(false);
            }
          }, 10000);
          break;
        }
        case "stop": {
          iframeRef.current?.contentWindow?.stop();
          loadingRef.current = false;
          setLoading(false);
          clearTimer();
          break;
        }
        case "home": {
          navigate("about:blank");
          break;
        }
      }
    },
    [history, navigate, clearTimer, setHistoryIndexAndRef],
  );

  const handleIframeLoad = useCallback(() => {
    loadingRef.current = false;
    setLoading(false);
    clearTimer();
    setBlocked(false);
    try {
      const title = iframeRef.current?.contentDocument?.title;
      if (title) {
        const idx = historyIndexRef.current;
        setHistory((prev) => {
          const updated = [...prev];
          if (updated[idx]) {
            updated[idx] = { ...updated[idx], title };
          }
          return updated;
        });
      }
    } catch {
      // Cross-origin — cannot read title, but page loaded fine
    }
  }, [clearTimer]);

  const handleIframeError = useCallback(() => {
    setBlocked(true);
    setLoading(false);
    clearTimer();
  }, [clearTimer]);

  const getBtnStyle = (disabled: boolean) => (disabled ? disabledBtnStyle : btnStyle);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif',
        color: "#000",
      }}
    >
      {/* Navigation buttons row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "4px 6px",
          background: "#c0c0c0",
          borderBottom: "1px solid #808080",
        }}
      >
        <button
          onClick={() => handleNav("back")}
          style={getBtnStyle(historyIndex <= 0)}
          disabled={historyIndex <= 0}
          aria-label="Back"
        >
          ◀
        </button>
        <button
          onClick={() => handleNav("forward")}
          style={getBtnStyle(historyIndex >= history.length - 1)}
          disabled={historyIndex >= history.length - 1}
          aria-label="Forward"
        >
          ▶
        </button>
        <button onClick={() => handleNav("refresh")} style={btnStyle} aria-label="Refresh">
          ⟳
        </button>
        <button onClick={() => handleNav("stop")} style={btnStyle} aria-label="Stop">
          ✕
        </button>
        <button onClick={() => handleNav("home")} style={btnStyle} aria-label="Home">
          🏠
        </button>
        {loading && (
          <span style={{ fontSize: 10, marginLeft: 8, color: "#000" }}>Loading...</span>
        )}
      </div>

      {/* Cosmetic menu bar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "2px 6px",
          background: "#c0c0c0",
          borderBottom: "2px solid #808080",
          fontSize: 11,
        }}
      >
        {MENU_ITEMS.map((item) => (
          <span
            key={item}
            style={{
              cursor: "default",
              padding: "1px 4px",
              color: "#000",
              textDecoration: "none",
            }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Address bar row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 6px",
          background: "#c0c0c0",
          borderBottom: "2px solid #808080",
          fontSize: 11,
        }}
      >
        <span style={{ fontWeight: 700, marginRight: 2, whiteSpace: "nowrap" }}>Address:</span>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate(address);
          }}
          style={sunkenInputStyle}
        />
        <button onClick={() => navigate(address)} style={btnStyle}>
          Go
        </button>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, position: "relative", background: "#fff" }}>
        {currentUrl === "about:blank" && !blocked ? (
          <div style={{ width: "100%", height: "100%", background: "#fff" }} />
        ) : blocked ? (
          <div
            style={{
              padding: 20,
              textAlign: "center",
              background: "#fff",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: "#000", marginBottom: 12 }}>
              This page cannot be displayed
            </div>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 8, maxWidth: 400 }}>
              {currentUrl} cannot be displayed in a frame.
            </div>
            <div style={{ fontSize: 11, color: "#666", maxWidth: 400 }}>
              Most sites block this for security. Try a different URL or use Normal Mode to visit the
              site directly.
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={currentUrl}
            sandbox="allow-scripts allow-forms allow-same-origin"
            style={{ width: "100%", height: "100%", border: "none", background: "#fff" }}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="Browser content"
          />
        )}
      </div>
    </div>
  );
}
