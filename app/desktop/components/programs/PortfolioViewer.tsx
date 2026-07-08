"use client";

import { useState } from "react";
import educationData from "@/app/data/education.json";
import experienceData from "@/app/data/experience.json";
import projectsData from "@/app/data/projects.json";
import certificationsData from "@/app/data/certifications.json";

type Tab = "education" | "experience" | "projects" | "certifications";

interface EducationItem {
  title: string;
  school: string;
  location: string;
  years: string;
  blurb: string;
  tags: string[];
  logo?: string;
}

interface ExperienceItem {
  title: string;
  blurb: string;
  category: string;
  organization?: string;
  competition?: string;
  placement?: string;
  date: string;
  tags: string[];
  images?: string[];
}

interface ProjectItem {
  title: string;
  summary: string;
  category: string;
  stack: string[];
  status: string;
  period: string;
  image?: string;
  highlights?: string[];
  links?: { label: string; href: string }[];
}

interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
  description: string;
  image?: string;
  tags?: string[];
  credentialUrl?: string;
}

const tabs: { id: Tab; label: string }[] = [
  { id: "education", label: "EDUCATION" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "projects", label: "PROJECTS" },
  { id: "certifications", label: "CERTS" },
];

export default function PortfolioViewer() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");

  const renderContent = () => {
    switch (activeTab) {
      case "education":
        return (educationData as EducationItem[]).map((item, i) => (
          <div key={i} className="pixel-card">
            <div className="pixel-card-header">
              <span className="pixel-arrow">&gt;</span>
              <span>{item.title}</span>
            </div>
            <div className="pixel-card-body">
              <div className="pixel-meta">{item.school} — {item.location}</div>
              <div className="pixel-date">{item.years}</div>
              <p className="pixel-desc">{item.blurb}</p>
              <div className="pixel-tags">
                {item.tags.map((t, j) => (
                  <span key={j} className="pixel-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ));

      case "experience":
        return (experienceData as ExperienceItem[]).map((item, i) => (
          <div key={i} className="pixel-card">
            <div className="pixel-card-header">
              <span className="pixel-arrow">&gt;</span>
              <span>{item.title}</span>
            </div>
            <div className="pixel-card-body">
              {item.organization && <div className="pixel-meta">{item.organization}</div>}
              {item.competition && <div className="pixel-meta">{item.competition}</div>}
              {item.placement && <div className="pixel-placement">[{item.placement}]</div>}
              <div className="pixel-date">{item.date}</div>
              <p className="pixel-desc">{item.blurb}</p>
              <div className="pixel-tags">
                {item.tags.map((t, j) => (
                  <span key={j} className="pixel-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ));

      case "projects":
        return (projectsData as ProjectItem[]).map((item, i) => (
          <div key={i} className="pixel-card">
            <div className="pixel-card-header">
              <span className="pixel-arrow">&gt;</span>
              <span>{item.title}</span>
              <span className={`pixel-status pixel-status-${item.status}`}>
                [{item.status}]
              </span>
            </div>
            <div className="pixel-card-body">
              <p className="pixel-desc">{item.summary}</p>
              <div className="pixel-tags">
                {item.stack.map((s, j) => (
                  <span key={j} className="pixel-tag">{s}</span>
                ))}
              </div>
              {item.highlights && item.highlights.length > 0 && (
                <ul className="pixel-list">
                  {item.highlights.map((h, j) => (
                    <li key={j} className="pixel-list-item">
                      <span className="pixel-bullet">*</span> {h}
                    </li>
                  ))}
                </ul>
              )}
              {item.links && item.links.filter((l) => l.href !== "#").length > 0 && (
                <div className="pixel-links">
                  {item.links.filter((l) => l.href !== "#").map((link, j) => (
                    <a key={j} className="pixel-link" href={link.href} target="_blank" rel="noopener noreferrer">
                      [{link.label}]
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ));

      case "certifications":
        return (certificationsData as CertificationItem[]).map((item, i) => (
          <div key={i} className="pixel-card">
            <div className="pixel-card-header">
              <span className="pixel-arrow">&gt;</span>
              <span>{item.title}</span>
            </div>
            <div className="pixel-card-body">
              <div className="pixel-meta">{item.issuer}</div>
              <div className="pixel-date">{item.date}</div>
              <p className="pixel-desc">{item.description}</p>
              {item.tags && item.tags.length > 0 && (
                <div className="pixel-tags">
                  {item.tags.map((t, j) => (
                    <span key={j} className="pixel-tag">{t}</span>
                  ))}
                </div>
              )}
              {item.credentialUrl && (
                <a className="pixel-link" href={item.credentialUrl} target="_blank" rel="noopener noreferrer">
                  [View Credential]
                </a>
              )}
            </div>
          </div>
        ));
    }
  };

  return (
    <div className="pixel-viewer" style={{
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "#0a0a0a",
      color: "#c0c0c0",
      fontSize: 11,
      lineHeight: 1.5,
      position: "relative",
    }}>
      <div className="pixel-scanlines" />
      <div className="pixel-grid-overlay" />

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
        padding: 8,
        scrollbarWidth: "thin",
        scrollbarColor: "#33ff33 #0a0a0a",
      }}>
        {renderContent()}
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
        {activeTab.toUpperCase()} — SELECTED | DATA FROM JSON
      </div>
    </div>
  );
}
