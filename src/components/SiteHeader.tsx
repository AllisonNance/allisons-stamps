"use client";

import { useState, useEffect } from "react";
import Logo from "./Logo";
import FilterBar from "./FilterBar";
import MobileFilterMenu from "./MobileFilterMenu";

interface FilterConfig {
  label: string;
  items: string[];
}

const SparkleIcon = ({ size = 27, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 27 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M22.5 0C22.9219 0 23.25 0.328125 23.25 0.75V3H25.5C25.9219 3 26.25 3.32812 26.25 3.75C26.25 4.17188 25.9219 4.5 25.5 4.5H23.25V6.75C23.25 7.17188 22.9219 7.5 22.5 7.5C22.0781 7.5 21.75 7.17188 21.75 6.75V4.5H19.5C19.0781 4.5 18.75 4.17188 18.75 3.75C18.75 3.32812 19.0781 3 19.5 3H21.75V0.75C21.75 0.328125 22.0781 0 22.5 0ZM9 3.75C9.28125 3.75 9.5625 3.9375 9.70312 4.17188L12.1875 9.5625L17.5781 12.0469C17.8125 12.1875 18 12.4688 18 12.75C18 13.0312 17.8125 13.3125 17.5781 13.4062L12.1875 15.9375L9.70312 21.3281C9.5625 21.5625 9.28125 21.75 9 21.75C8.71875 21.75 8.4375 21.5625 8.34375 21.3281L5.8125 15.9375L0.421875 13.4062C0.1875 13.3125 0 13.0312 0 12.75C0 12.4688 0.1875 12.1875 0.421875 12.0938L5.8125 9.5625L8.29688 4.17188C8.4375 3.9375 8.71875 3.75 9 3.75ZM9 6.28125L7.07812 10.4531C6.98438 10.6406 6.89062 10.7344 6.70312 10.8281L2.53125 12.75L6.70312 14.6719C6.89062 14.7656 6.98438 14.9062 7.07812 15.0469L9 19.2188L10.9219 15.0469C11.0156 14.9062 11.1562 14.7656 11.2969 14.6719L15.4688 12.75L11.2969 10.8281C11.1094 10.7344 11.0156 10.6406 10.9219 10.4531L9 6.28125ZM21.75 18.75V21H24C24.4219 21 24.75 21.3281 24.75 21.75C24.75 22.1719 24.4219 22.5 24 22.5H21.75V24.75C21.75 25.1719 21.4219 25.5 21 25.5C20.5781 25.5 20.25 25.1719 20.25 24.75V22.5H18C17.5781 22.5 17.25 22.1719 17.25 21.75C17.25 21.3281 17.5781 21 18 21H20.25V18.75C20.25 18.3281 20.5781 18 21 18C21.4219 18 21.75 18.3281 21.75 18.75Z"
      fill="currentColor"
    />
  </svg>
);

interface SiteHeaderProps {
  filters: FilterConfig[];
  onFilterChange?: (selections: Record<string, string[]>) => void;
  onShuffle?: () => void;
}

export default function SiteHeader({ filters, onFilterChange, onShuffle }: SiteHeaderProps) {
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
      <header style={{ background: "var(--background)", padding: "32px 32px 32px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Logo height={140} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
          <FilterBar filters={filters} onChange={handleFilterChange} />
          <button
            type="button"
            onClick={onShuffle}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector("[data-underline]")!.style.borderColor = "#8E8A7C";
              e.currentTarget.querySelector("[data-sparkle]")!.classList.add("sparkle-active");
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector("[data-underline]")!.style.borderColor = "transparent";
              e.currentTarget.querySelector("[data-sparkle]")!.classList.remove("sparkle-active");
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
            <style>{`
              @keyframes sparkle {
                0%, 100% { opacity: 1; transform: scale(1); }
                25% { opacity: 0.6; transform: scale(0.85); }
                50% { opacity: 1; transform: scale(1.15); }
                75% { opacity: 0.7; transform: scale(0.95); }
              }
              .sparkle-active { animation: sparkle 0.6s ease-in-out infinite; }
            `}</style>
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
              <span data-sparkle style={{ display: "inline-flex" }}>
                <SparkleIcon size={18} />
              </span>
              <span style={{ fontSize: 18, fontWeight: 300 }}>Surprise Me</span>
            </span>
          </button>
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
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              color: "#5E5A4B",
            }}
            aria-label="Surprise me"
          >
            <SparkleIcon size={24} />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            style={{
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
