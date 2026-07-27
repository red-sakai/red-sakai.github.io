"use client";

import { useState, type FormEvent } from "react";
import { useDesktopSounds } from "@/hooks/useDesktopSounds";

interface LoginModalProps {
  onSuccess: () => void;
  onCancel: () => void;
  animating?: boolean;
}

const USER_ICON = (
  <svg width="48" height="48" viewBox="0 0 48 48" style={{ display: "block", imageRendering: "pixelated" }}>
    <circle cx="24" cy="14" r="8" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
    <rect x="16" y="24" width="16" height="10" fill="#000080" stroke="#000" strokeWidth="1" />
    <rect x="12" y="22" width="24" height="4" fill="#000080" stroke="#000" strokeWidth="1" />
    <rect x="20" y="12" width="2" height="2" fill="#000" />
    <rect x="26" y="12" width="2" height="2" fill="#000" />
    <line x1="20" y1="17" x2="28" y2="17" stroke="#000" strokeWidth="1" />
  </svg>
);

export default function LoginModal({ onSuccess, onCancel, animating }: LoginModalProps) {
  const [password, setPassword] = useState("");
  const sounds = useDesktopSounds();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sounds.play("click");
    try {
      const loginAudio = new Audio("/audio/windows_98_login.mp3");
      loginAudio.volume = 0.5;
      loginAudio.play().catch(() => {});
    } catch {}
    onSuccess();
  };

  const handleCancel = () => {
    sounds.play("close");
    onCancel();
  };

  return (
    <div className={`win98-window${animating ? " login-vanish" : ""}`} style={{ width: 380, position: "relative" }}>
      <div className="win98-titlebar">
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          Log On to Jhered OS
        </span>
        <div className="win98-title-buttons">
          <button className="win98-title-btn" onClick={handleCancel} aria-label="Close">✕</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: 16, color: "#000", fontSize: 11, display: "flex", gap: 16 }}>
        <div style={{ flexShrink: 0, width: 48, height: 48, border: "1px solid #000", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {USER_ICON}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <label>User name:</label>
            <input
              type="text"
              value="Jhered OS"
              readOnly
              className="win98-field"
              style={{ cursor: "default" }}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="win98-field"
            />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
            <button type="submit" className="win98-title-btn" style={{ padding: "4px 16px", width: 70, height: 22, fontSize: 11 }}>OK</button>
            <button type="button" className="win98-title-btn" style={{ padding: "4px 16px", width: 70, height: 22, fontSize: 11 }} onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </form>

      <div style={{ borderTop: "1px solid #808080", padding: "4px 8px", fontSize: 10, color: "#808080", textAlign: "center" }}>
        Jhered OS
      </div>
    </div>
  );
}
