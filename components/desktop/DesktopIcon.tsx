"use client";

import styles from "./windows98.module.css";

type DesktopIconProps = {
  label: string;
  glyph: string;
  onOpen: () => void;
};

export function DesktopIcon({ label, glyph, onOpen }: DesktopIconProps) {
  return (
    <button
      type="button"
      className={styles.desktopIcon}
      onDoubleClick={onOpen}
      onClick={(event) => event.currentTarget.focus()}
    >
      <span className={styles.iconGlyph} aria-hidden>
        {glyph}
      </span>
      <span className={styles.iconLabel}>{label}</span>
    </button>
  );
}
