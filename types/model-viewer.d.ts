import type { ReactNode } from "react";

interface ModelViewerAttributes {
  src?: string;
  alt?: string;
  children?: ReactNode;
  className?: string;
  style?: Record<string, string | number | undefined>;
  "camera-controls"?: boolean;
  "auto-rotate"?: boolean;
  "disable-tap"?: boolean;
  "interaction-prompt"?: string;
  "shadow-intensity"?: string | number;
  exposure?: string | number;
  "touch-action"?: string;
  "camera-orbit"?: string;
  "field-of-view"?: string;
  [key: string]: unknown;
}

declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": ModelViewerAttributes;
  }
}
