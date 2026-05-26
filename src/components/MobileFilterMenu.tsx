"use client";

import { useState, useEffect, useRef } from "react";
import Checkbox from "./Checkbox";
import SearchInput from "./SearchInput";

interface FilterConfig {
  label: string;
  items: string[];
}

interface MobileFilterMenuProps {
  open: boolean;
  onClose: () => void;
  filters: FilterConfig[];
  selections: Record<string, string[]>;
  onSelectionChange: (label: string, selected: string[]) => void;
  onClearAll: () => void;
}

function AccordionSection({
  label,
  items,
  selected,
  onChange,
}: {
  label: string;
  items: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");

  const panelId = `mobile-filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const searchable = items.length > 10;
  const filtered = search
    ? items.filter((item) => item.toLowerCase().includes(search.toLowerCase()))
    : items;
  const scrollable = filtered.length > 10;
  const count = selected.length;

  function handleChange(item: string, isChecked: boolean) {
    const next = isChecked
      ? [...selected, item]
      : selected.filter((i) => i !== item);
    onChange(next);
  }

  return (
    <div style={{ borderBottom: "1px solid #E9E9E9" }}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={panelId}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "16px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#5E5A4B",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 300 }}>{label}</span>
          {count > 0 && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 20,
                height: 20,
                backgroundColor: "#999070",
                color: "#FFFFFF",
                fontSize: 10,
                fontWeight: 600,
                borderRadius: 4,
              }}
            >
              {count}
            </span>
          )}
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          style={{
            transition: "transform 0.15s",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {expanded && (
        <div id={panelId} role="group" aria-label={`${label} options`} style={{ paddingBottom: 16 }}>
          {searchable && (
            <div style={{ marginBottom: 12 }}>
              <SearchInput placeholder="" value={search} onChange={setSearch} />
            </div>
          )}
          <div
            style={scrollable ? {
              maxHeight: 280,
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#5E5A4B transparent",
            } : undefined}
          >
            {filtered.map((item) => (
              <Checkbox
                key={item}
                label={item}
                checked={selected.includes(item)}
                onChange={(isChecked) => handleChange(item, isChecked)}
              />
            ))}
            {filtered.length === 0 && (
              <p style={{ fontSize: 14, color: "#8E8A7C", padding: "8px 4px" }}>
                No matches
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MobileFilterMenu({
  open,
  onClose,
  filters,
  selections,
  onSelectionChange,
  onClearAll,
}: MobileFilterMenuProps) {
  const hasAnySelected = Object.values(selections).some((s) => s.length > 0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !menuRef.current) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const closeBtn = menuRef.current.querySelector<HTMLElement>("[aria-label='Close filters']");
    closeBtn?.focus();
    return () => { previouslyFocused?.focus(); };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-label="Filters"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 16px 16px",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 500, color: "#5E5A4B" }}>
          Filters
        </span>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#5E5A4B",
            padding: 4,
          }}
          aria-label="Close filters"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 16px",
        }}
      >
        {filters.map((filter) => (
          <AccordionSection
            key={filter.label}
            label={filter.label}
            items={filter.items}
            selected={selections[filter.label] || []}
            onChange={(selected) => onSelectionChange(filter.label, selected)}
          />
        ))}
      </div>

      {hasAnySelected && (
        <div
          style={{
            flexShrink: 0,
            padding: 16,
            borderTop: "1px solid #E9E9E9",
          }}
        >
          <button
            type="button"
            onClick={onClearAll}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#DEDEDE"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#EBEBEB"}
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: 16,
              color: "var(--color-text)",
              backgroundColor: "#EBEBEB",
              border: "none",
              cursor: "pointer",
              borderRadius: 4,
              transition: "background-color 0.15s ease",
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
