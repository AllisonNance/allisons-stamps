"use client";

import { useState, useEffect, useRef } from "react";
import Checkbox from "./Checkbox";
import SearchInput from "./SearchInput";
import styles from "./MobileFilterMenu.module.css";

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
    <div className={styles.section}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className={styles.sectionTrigger}
      >
        <div className={styles.sectionLabel}>
          <span className={styles.sectionName}>{label}</span>
          {count > 0 && (
            <span className={styles.sectionBadge}>{count}</span>
          )}
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className={`${styles.sectionChevron} ${expanded ? styles.sectionChevronOpen : ""}`}
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="#5E5A4B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {expanded && (
        <div id={panelId} role="group" aria-label={`${label} options`} className={styles.sectionPanel}>
          {searchable && (
            <div className={styles.sectionSearch}>
              <SearchInput placeholder="" value={search} onChange={setSearch} />
            </div>
          )}
          <div className={scrollable ? styles.sectionScroll : undefined}>
            {filtered.map((item) => (
              <Checkbox
                key={item}
                label={item}
                checked={selected.includes(item)}
                onChange={(isChecked) => handleChange(item, isChecked)}
              />
            ))}
            {filtered.length === 0 && (
              <p className={styles.empty}>No matches</p>
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
      className={styles.overlay}
    >
      <div className={styles.header}>
        <span className={styles.title}>Filters</span>
        <button
          type="button"
          onClick={onClose}
          className={styles.closeButton}
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

      <div className={styles.body}>
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
        <div className={styles.footer}>
          <button
            type="button"
            onClick={onClearAll}
            className={styles.clearButton}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
