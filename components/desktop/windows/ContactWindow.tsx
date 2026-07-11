"use client";

import { useState } from "react";
import styles from "../windows98.module.css";

export function ContactWindow() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className={styles.windowInnerScroll}>
      <form
        className={styles.contactForm}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className={styles.contactRow}>
          <label htmlFor="contact-name">Name</label>
          <input className={styles.contactInput} id="contact-name" type="text" required />
        </div>
        <div className={styles.contactRow}>
          <label htmlFor="contact-email">Email</label>
          <input className={styles.contactInput} id="contact-email" type="email" required />
        </div>
        <div className={styles.contactRow}>
          <label htmlFor="contact-message">Message</label>
          <textarea
            className={styles.contactTextArea}
            id="contact-message"
            rows={4}
            required
          />
        </div>
        <button className={styles.contactButton} type="submit">
          {submitted ? "Saved" : "Send"}
        </button>
        {submitted && <div>Message queued for delivery.</div>}
      </form>
    </div>
  );
}
