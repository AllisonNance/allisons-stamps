"use client";

import { useState, useEffect } from "react";
import Logo from "./Logo";

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
    <footer
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        padding: isDesktop ? 32 : 16,
      }}
    >
      <Logo height={isDesktop ? 110 : 80} />
      <div style={{ textAlign: "right" }}>
        <a
          href="mailto:allison@availta.com"
          style={{
            color: "var(--color-text)",
            textDecoration: "underline",
            fontSize: 14,
          }}
        >
          Get in Touch
        </a>
        <p style={{ fontSize: 14, margin: "8px 0 0", color: "var(--color-text)" }}>
          &copy; 2026 Allison Nance
        </p>
      </div>
    </footer>
  );
}
