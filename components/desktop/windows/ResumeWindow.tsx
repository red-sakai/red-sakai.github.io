"use client";

import styles from "../windows98.module.css";

export function ResumeWindow() {
  return (
    <div className={styles.windowInnerScroll}>
      <div className={styles.iframeWrap}>
        <iframe
          title="Resume PDF"
          src="/JHERED_MIGUEL_REPUBLICA.pdf"
          className={styles.portfolioFrame}
        />
      </div>
    </div>
  );
}
