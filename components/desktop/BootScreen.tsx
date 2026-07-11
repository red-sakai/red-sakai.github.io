"use client";

import { useEffect, useState } from "react";
import styles from "./windows98.module.css";

type BootScreenProps = {
  onFinish: () => void;
};

export function BootScreen({ onFinish }: BootScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
      onFinish();
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className={styles.bootScreen} role="status" aria-live="polite">
      <div className={styles.bootLogo}>Starting Windows...</div>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} />
      </div>
      <div className={styles.bootHint}>Please wait</div>
    </div>
  );
}
