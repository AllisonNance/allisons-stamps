"use client";

import { useState, useEffect } from "react";
import Logo from "./Logo";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <footer className={`${styles.footer} ${isDesktop ? styles.footerDesktop : ""}`}>
      <Logo height={isDesktop ? 110 : 80} />
      <div className={styles.right}>
        <a href="mailto:allison@availta.com" className={styles.link}>
          Get in Touch
        </a>
        <p className={styles.copyright}>&copy; 2026 Allison Nance</p>
      </div>
    </footer>
  );
}
