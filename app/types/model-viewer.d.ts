declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": {
      src?: string;
      alt?: string;
      children?: any;
      className?: string;
      style?: Record<string, any>;
      "camera-controls"?: boolean;
      "auto-rotate"?: boolean;
      "disable-tap"?: boolean;
      "interaction-prompt"?: string;
      "shadow-intensity"?: string | number;
      exposure?: string | number;
      "touch-action"?: string;
      "camera-orbit"?: string;
      "field-of-view"?: string;
      [key: string]: any;
    };
  }
}
