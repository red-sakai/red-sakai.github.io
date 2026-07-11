"use client";

export default function AboutMeWindow() {
  return (
    <div style={{ padding: 8, fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif', fontSize: 12, color: "#000" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
        <div
          style={{
            width: 64, height: 64, background: "#c0c0c0", borderRadius: 4,
            border: "2px solid #808080", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 32, flexShrink: 0,
          }}
        >
          👤
        </div>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px", color: "#000" }}>Jhered Miguel Republica</h1>
          <p style={{ margin: 0, color: "#333" }}>BS Computer Engineering</p>
          <p style={{ margin: 0, color: "#333" }}>Polytechnic University of the Philippines</p>
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 6px", color: "#000" }}>About</h2>
        <p style={{ margin: 0, color: "#333", lineHeight: 1.5 }}>
          Software engineer and cybersecurity enthusiast passionate about building
          interactive web experiences. I love combining retro aesthetics with modern
          technology — this desktop is a testament to that.
        </p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 6px", color: "#000" }}>Interests</h2>
        <ul style={{ margin: 0, paddingLeft: 20, color: "#333" }}>
          <li>Web Development (Next.js, React)</li>
          <li>Cybersecurity & Network Defense</li>
          <li>Retro Computing & UI Design</li>
          <li>Game Development</li>
        </ul>
      </div>
      <div>
        <h2 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 6px", color: "#000" }}>Contact</h2>
        <p style={{ margin: 0, color: "#333" }}>📧 jhered@example.com</p>
        <p style={{ margin: 0, color: "#333" }}>🌐 jhered.me</p>
      </div>
    </div>
  );
}
