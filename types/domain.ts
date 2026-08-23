export interface WallpaperState {
  type: "color" | "preset" | "imported";
  value: string;
  fit: "tile" | "center" | "stretch";
}

export interface ColorSchemeDef {
  id: string;
  label: string;
  vars: Record<string, string>;
}

export type ExperienceCategory = "professional" | "organizational" | "competitive";

export type ExperienceItem = {
  title: string;
  blurb: string;
  category: ExperienceCategory;
  company?: string;
  organization?: string;
  competition?: string;
  orgType?: string;
  date?: string;
  placement?: string;
  tags?: string[];
  images?: string[];
  image?: string;
};

export type OrgGroup = {
  organization: string;
  orgType: string;
  positions: { title: string; date?: string; blurb: string }[];
  tags: string[];
  images: string[];
};

export type ProjectCategory = "web" | "security" | "tools" | "learning" | "emergency" | "game" | "bot";
export type ProjectType = "personal" | "commissioned" | "hackathon";

export type ProjectLink = {
  label: string;
  href: string;
  type?: "repo" | "demo";
};

export type ProjectItem = {
  title: string;
  summary: string;
  category: ProjectCategory;
  projectType: ProjectType;
  stack: string[];
  image?: string;
  highlights?: string[];
  links?: ProjectLink[];
  status?: "in-progress" | "beta" | "shipped" | "discontinued";
  period?: string;
};

export type Certification = {
  title: string;
  issuer: string;
  date: string;
  description: string;
  credentialUrl?: string;
  tags?: string[];
  image?: string;
  imageAlt?: string;
  certificateImage?: string;
  certificateAlt?: string;
};

export type JournalBlock =
  | { type: "text"; text: string }
  | {
      type: "image";
      src: string;
      alt?: string;
      caption?: string;
      width?: number;
      height?: number;
    };

export type JournalEntry = {
  date: string;
  title: string;
  entry?: string;
  content?: JournalBlock[];
  mood?: string;
};

export type Milestone = {
  year: string;
  title: string;
  description: string;
  tags: string[];
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export type Focus = {
  title: string;
  body: string;
};

export type TerminalEntryMap = {
  input: { text: string };
  output: { text: string };
  profile: { revealKey?: number };
};

export type TerminalEntry = {
  [Key in keyof TerminalEntryMap]: { id: number; type: Key } & TerminalEntryMap[Key];
}[keyof TerminalEntryMap];

export type TerminalEntryInput = {
  [Key in keyof TerminalEntryMap]: { type: Key } & TerminalEntryMap[Key];
}[keyof TerminalEntryMap];
