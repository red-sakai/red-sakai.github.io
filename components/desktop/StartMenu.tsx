"use client";

import styles from "./windows98.module.css";

type StartMenuProps = {
  open: boolean;
};

const menuItems = [
  "Programs",
  "Documents",
  "Settings",
  "Find",
  "Help",
  "Run...",
  "Shut Down",
];

export function StartMenu({ open }: StartMenuProps) {
  if (!open) return null;

  return (
    <div className={styles.startMenu}>
      <div className={styles.startMenuHeader}>Windows 98</div>
      <div className={styles.startMenuItems}>
        {menuItems.map((item) => (
          <div key={item} className={styles.startMenuItem}>
            <span>{item}</span>
            <span>&gt;</span>
          </div>
        ))}
      </div>
    </div>
  );
}
