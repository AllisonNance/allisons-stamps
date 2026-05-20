"use client";

import { useState, useEffect } from "react";
import Logo from "./Logo";
import FilterBar from "./FilterBar";
import MobileFilterMenu from "./MobileFilterMenu";

interface FilterConfig {
  label: string;
  items: string[];
}

interface SiteHeaderProps {
  filters: FilterConfig[];
  onFilterChange?: (selections: Record<string, string[]>) => void;
}

export default function SiteHeader({ filters, onFilterChange }: SiteHeaderProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selections, setSelections] = useState<Record<string, string[]>>({});

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
      <header style={{ background: "var(--background)", padding: "48px 24px 32px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Logo height={140} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
          <FilterBar filters={filters} onChange={handleFilterChange} />
        </div>
      </header>
    );
  }

  return (
    <>
      <header style={{ background: "var(--background)", padding: 16, position: "relative" }}>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
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
          >
            <path
              fill="currentColor"
              d="M66.4 147.8C71.4 135.8 83.1 128 96 128L544 128C556.9 128 568.6 135.8 573.6 147.8C578.6 159.8 575.8 173.5 566.7 182.7L384 365.3L384 544C384 556.9 376.2 568.6 364.2 573.6C352.2 578.6 338.5 575.8 329.3 566.7L265.3 502.7C259.3 496.7 255.9 488.6 255.9 480.1L256 365.3L73.4 182.6C64.2 173.5 61.5 159.7 66.4 147.8zM544 160L96 160L283.3 347.3C286.3 350.3 288 354.4 288 358.6L288 480L352 544L352 358.6C352 354.4 353.7 350.3 356.7 347.3L544 160z"
            />
          </svg>
        </button>
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
