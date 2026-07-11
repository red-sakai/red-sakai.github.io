"use client";

import styles from "../windows98.module.css";

export function RecycleBinWindow() {
  return (
    <div className={styles.windowInnerScroll}>
      <p>The Recycle Bin is empty. There is nothing to undo yet.</p>
      <p>Try making a mess first.</p>
    </div>
  );
}
