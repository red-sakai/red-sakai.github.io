"use client";

import { useState } from "react";

interface FileEntry {
  name: string;
  type: "folder" | "file";
  icon: string;
  content?: string;
  children?: FileEntry[];
}

const fileSystem: FileEntry[] = [
  {
    name: "Projects", type: "folder", icon: "📁",
    children: [
      { name: "Lunti", type: "file", icon: "📄", content: "ESG compliance tracker for construction teams with offline capture and automated reports." },
      { name: "BlockBayan", type: "file", icon: "📄", content: "Blockchain-backed donation ledger for transparent disaster relief operations." },
      { name: "Algohub", type: "file", icon: "📄", content: "Gamified DSA learning platform with achievements and progression." },
      { name: "Pixie", type: "file", icon: "📄", content: "AI voice interviewer for PUP organization screenings." },
      { name: "Static Mind", type: "file", icon: "📄", content: "Unity horror game — escape Dr. Red's lab before losing your sanity." },
    ],
  },
  {
    name: "Education", type: "folder", icon: "📁",
    children: [
      { name: "BS Computer Engineering", type: "file", icon: "📄", content: "Polytechnic University of the Philippines — 2024-Present" },
      { name: "STEM - Rizal High School", type: "file", icon: "📄", content: "Science, Technology, Engineering, and Mathematics — 2018-2024" },
    ],
  },
  {
    name: "Experience", type: "folder", icon: "📁",
    children: [
      { name: "Vice CEO - Cisco NetConnect", type: "file", icon: "📄", content: "Supporting organizational leadership and technical initiatives." },
      { name: "Head of Engineering - ICPEP SE", type: "file", icon: "📄", content: "Leading engineering teams and projects at PUP." },
      { name: "Cybersecurity Cadet - GDG", type: "file", icon: "📄", content: "Learning and applying security fundamentals." },
    ],
  },
  {
    name: "Certifications", type: "folder", icon: "📁",
    children: [
      { name: "Google Cybersecurity Certificate", type: "file", icon: "📄", content: "Security controls, SIEM, detection engineering." },
      { name: "IBM Cybersecurity Analyst", type: "file", icon: "📄", content: "Threat analysis, incident response, SOC operations." },
    ],
  },
];

export default function FileExplorer() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["Projects", "Education", "Experience", "Certifications"]));
  const [selected, setSelected] = useState<FileEntry | null>(null);

  const toggleFolder = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const renderTree = (entries: FileEntry[], depth = 0) => (
    <div>
      {entries.map((entry) => (
        <div key={entry.name}>
          <div
            style={{
              display: "flex", alignItems: "center", gap: 4, padding: "2px 4px 2px 12px",
              cursor: "pointer", fontSize: 12, userSelect: "none",
              background: selected?.name === entry.name ? "#000080" : undefined,
              color: selected?.name === entry.name ? "#fff" : "#000",
              marginLeft: depth * 16,
            }}
            onClick={() => {
              if (entry.type === "folder") toggleFolder(entry.name);
              else setSelected(entry);
            }}
            onDoubleClick={() => {
              if (entry.type === "folder") toggleFolder(entry.name);
              else setSelected(entry);
            }}
          >
            <span>{entry.type === "folder" ? (expanded.has(entry.name) ? "📂" : entry.icon) : entry.icon}</span>
            <span>{entry.name}</span>
          </div>
          {entry.type === "folder" && expanded.has(entry.name) && entry.children && renderTree(entry.children, depth + 1)}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif', color: "#000" }}>
      <div style={{ width: "40%", borderRight: "2px solid #808080", overflow: "auto", background: "#fff" }}>
        {renderTree(fileSystem)}
      </div>
      <div style={{ flex: 1, padding: 8, overflow: "auto", background: "#fff", fontSize: 12 }}>
        {selected ? (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px", color: "#000" }}>{selected.name}</h3>
            <p style={{ margin: 0, color: "#333", lineHeight: 1.5 }}>{selected.content}</p>
          </div>
        ) : (
          <p style={{ color: "#666", margin: 0 }}>Select a file to view its contents.</p>
        )}
      </div>
    </div>
  );
}
