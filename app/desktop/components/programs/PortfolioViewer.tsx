"use client";

import { useState } from "react";
import { EducationSection } from "@/app/components/sections/Education";
import { ExperienceSection } from "@/app/components/sections/Experience";
import { ProjectsSection } from "@/app/components/sections/Projects";
import { CertificationsSection } from "@/app/components/sections/Certifications";
import PixelatedWrapper from "./PixelatedWrapper";

type Tab = "education" | "experience" | "projects" | "certifications";

const tabs: { id: Tab; label: string }[] = [
  { id: "education", label: "EDUCATION" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "projects", label: "PROJECTS" },
  { id: "certifications", label: "CERTS" },
];

export default function PortfolioViewer() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");

  const renderSection = () => {
    switch (activeTab) {
      case "education":
        return <EducationSection />;
      case "experience":
        return <ExperienceSection />;
      case "projects":
        return <ProjectsSection />;
      case "certifications":
        return <CertificationsSection />;
    }
  };

  return (
    <div className="pixel-viewer" style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "#0a0a0a",
      position: "relative",
    }}>
      <div className="pixel-titlebar" style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderBottom: "2px solid #33ff33",
        fontFamily: "var(--font-pixel), monospace",
        fontSize: 10,
        color: "#33ff33",
        background: "#0d0d0d",
        letterSpacing: 1,
        flexShrink: 0,
      }}>
        <span style={{ color: "#33ff33" }}>◆</span>
        <span>JHERED OS — PORTFOLIO.EXE</span>
      </div>

      <div className="pixel-tabs" style={{
        display: "flex",
        gap: 0,
        borderBottom: "2px solid #33ff33",
        flexShrink: 0,
        background: "#0d0d0d",
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className="pixel-tab"
            onClick={() => setActiveTab(tab.id)}
            style={{
              fontFamily: "var(--font-pixel), monospace",
              fontSize: 9,
              padding: "6px 12px",
              cursor: "pointer",
              border: "none",
              borderRight: "1px solid #1a1a1a",
              color: activeTab === tab.id ? "#33ff33" : "#555",
              background: activeTab === tab.id ? "#0a0a0a" : "#111",
              letterSpacing: 0.5,
              borderBottom: activeTab === tab.id ? "2px solid #33ff33" : "2px solid transparent",
              marginBottom: -2,
              transition: "none",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pixel-content" style={{
        flex: 1,
        overflow: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "#33ff33 #0a0a0a",
      }}>
        <PixelatedWrapper>
          {renderSection()}
        </PixelatedWrapper>
      </div>

      <div className="pixel-statusbar" style={{
        borderTop: "2px solid #33ff33",
        padding: "3px 10px",
        fontSize: 9,
        color: "#33ff33",
        fontFamily: "var(--font-pixel), monospace",
        background: "#0d0d0d",
        letterSpacing: 0.5,
        flexShrink: 0,
      }}>
        {activeTab.toUpperCase()} — SELECTED
      </div>
    </div>
  );
}
