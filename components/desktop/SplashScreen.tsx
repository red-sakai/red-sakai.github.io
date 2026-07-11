"use client";

import { useEffect } from "react";
import styles from "./windows98.module.css";

type SplashScreenProps = {
  onStart: () => void;
};

export function SplashScreen({ onStart }: SplashScreenProps) {
  useEffect(() => {
    const handleKey = () => onStart();
    const handlePointer = () => onStart();

    window.addEventListener("keydown", handleKey);
    window.addEventListener("pointerdown", handlePointer);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("pointerdown", handlePointer);
    };
  }, [onStart]);

  return (
    <div className={styles.splashScreen} role="presentation">
      <div className={styles.splashLogo} aria-hidden>
        <span className={styles.flagBlock} />
        <span className={styles.flagBlock} />
        <span className={styles.flagBlock} />
        <span className={styles.flagBlock} />
      </div>
      <div className={styles.splashTitle}>Microsoft Windows 98</div>
      <div className={styles.splashPrompt}>Press any key to start...</div>
    </div>
  );
}
