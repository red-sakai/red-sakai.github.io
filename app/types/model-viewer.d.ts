import type React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        alt?: string;
        "camera-controls"?: boolean;
        "auto-rotate"?: boolean;
        "disable-tap"?: boolean;
        "shadow-intensity"?: string | number;
        exposure?: string | number;
        "touch-action"?: string;
        "camera-orbit"?: string;
        "field-of-view"?: string;
      };
    }
  }
}

export {};
