"use client";

import { EducationSection } from "@/app/components/sections/Education";
import { ExperienceSection } from "@/app/components/sections/Experience";
import { ProjectsSection } from "@/app/components/sections/Projects";
import { CertificationsSection } from "@/app/components/sections/Certifications";
import PixelatedWrapper from "./PixelatedWrapper";

export default function PortfolioViewer() {
  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "transparent",
      position: "relative",
    }}>
      <div className="pixel-titlebar" style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 8px",
        borderBottom: "1px solid #808080",
        fontFamily: "var(--font-pixel), monospace",
        fontSize: 10,
        color: "#fff",
        background: "#000080",
        flexShrink: 0,
      }}>
        <span>🏠</span>
        <span>My Portfolio</span>
      </div>

      <div style={{
        flex: 1,
        overflow: "auto",
        scrollbarWidth: "thin",
      }}>
        <PixelatedWrapper>
          <EducationSection />
          <ExperienceSection />
          <ProjectsSection />
          <CertificationsSection />
        </PixelatedWrapper>
      </div>
    </div>
  );
}
