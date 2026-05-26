"use client";

import { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import FilterBar from "./FilterBar";
import MobileFilterMenu from "./MobileFilterMenu";
import { SparklesIcon, type SparklesIconHandle } from "./SparklesIcon";

interface FilterConfig {
  label: string;
  items: string[];
}

interface SiteHeaderProps {
  filters: FilterConfig[];
  onFilterChange?: (selections: Record<string, string[]>) => void;
  onShuffle?: () => void;
}

export default function SiteHeader({ filters, onFilterChange, onShuffle }: SiteHeaderProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const sparkleRef = useRef<SparklesIconHandle>(null);
  const mobileSparkleRef = useRef<SparklesIconHandle>(null);

  const hasAnySelected = Object.values(selections).some((s) => s.length > 0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      if (e.matches) setMobileMenuOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isDesktop) return;
    mobileSparkleRef.current?.startAnimation();
    const timer = setTimeout(() => {
      mobileSparkleRef.current?.stopAnimation();
    }, 3600);
    return () => clearTimeout(timer);
  }, [isDesktop]);

  function handleFilterChange(newSelections: Record<string, string[]>) {
    setSelections(newSelections);
    onFilterChange?.(newSelections);
  }

  function handleMobileSelectionChange(label: string, selected: string[]) {
    const next = { ...selections, [label]: selected };
    setSelections(next);
    onFilterChange?.(next);
  }

  function handleClearAll() {
    const next = Object.fromEntries(filters.map((f) => [f.label, []]));
    setSelections(next);
    onFilterChange?.(next);
  }

  if (isDesktop) {
    return (
      <header style={{ background: "var(--background)", padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Logo height={110} />
          <FilterBar filters={filters} onChange={handleFilterChange} />
          <div style={{ marginLeft: "auto" }}>
          <button
            type="button"
            onClick={onShuffle}
            onMouseEnter={(e) => {
              (e.currentTarget.querySelector("[data-underline]") as HTMLElement).style.borderColor = "#8E8A7C";
              sparkleRef.current?.startAnimation();
            }}
            onMouseLeave={(e) => {
              (e.currentTarget.querySelector("[data-underline]") as HTMLElement).style.borderColor = "transparent";
              sparkleRef.current?.stopAnimation();
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              background: "var(--background)",
              color: "#5E5A4B",
              border: "none",
              cursor: "pointer",
            }}
            aria-label="Surprise me"
          >
            <span
              data-underline
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderBottom: "2px solid transparent",
                paddingBottom: 4,
                transition: "border-color 0.15s",
              }}
            >
              <SparklesIcon ref={sparkleRef} size={22} />
              <span style={{ fontSize: 18, fontWeight: 300 }}>Surprise Me</span>
            </span>
          </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header style={{ background: "var(--background)", padding: 16, position: "relative" }}>
        <div style={{ position: "absolute", top: 16, right: 16, display: "flex", alignItems: "center", gap: 20 }}>
          <button
            type="button"
            onClick={onShuffle}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              width: 28,
              height: 28,
            }}
            aria-label="Surprise me"
          >
            <SparklesIcon ref={mobileSparkleRef} size={26} />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              width: 28,
              height: 28,
              color: hasAnySelected ? "#999070" : "#5E5A4B",
            }}
            aria-label="Open filters"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 640 640"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M66.4 147.8C71.4 135.8 83.1 128 96 128L544 128C556.9 128 568.6 135.8 573.6 147.8C578.6 159.8 575.8 173.5 566.7 182.7L384 365.3L384 544C384 556.9 376.2 568.6 364.2 573.6C352.2 578.6 338.5 575.8 329.3 566.7L265.3 502.7C259.3 496.7 255.9 488.6 255.9 480.1L256 365.3L73.4 182.6C64.2 173.5 61.5 159.7 66.4 147.8zM544 160L96 160L283.3 347.3C286.3 350.3 288 354.4 288 358.6L288 480L352 544L352 358.6C352 354.4 353.7 350.3 356.7 347.3L544 160z"
              />
            </svg>
          </button>
        </div>
        <Logo height={80} />
      </header>
      <MobileFilterMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        filters={filters}
        selections={selections}
        onSelectionChange={handleMobileSelectionChange}
        onClearAll={handleClearAll}
      />
    </>
  );
}
