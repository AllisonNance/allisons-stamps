"use client";

import { useState, useRef, useEffect } from "react";
import Checkbox from "./Checkbox";
import SearchInput from "./SearchInput";
import styles from "./FilterDropdown.module.css";

interface FilterDropdownProps {
  label: string;
  items: string[];
  selected?: string[];
  onChange?: (selected: string[]) => void;
}

export default function FilterDropdown({
  label,
  items,
  selected = [],
  onChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<string[]>(selected);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const valid = checked.filter((c) => items.includes(c));
    if (valid.length !== checked.length) {
      setChecked(valid);
      onChange?.(valid);
    }
  }, [items]);

  const searchable = items.length > 10;
  const filtered = search
    ? items.filter((item) => item.toLowerCase().includes(search.toLowerCase()))
    : items;
  const scrollable = filtered.length > 10;
  const count = checked.length || undefined;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape" && open) {
      e.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    }
  }

  function handleChange(item: string, isChecked: boolean) {
    const next = isChecked
      ? [...checked, item]
      : checked.filter((i) => i !== item);
    setChecked(next);
    onChange?.(next);
  }

  function handleClear() {
    setChecked([]);
    onChange?.([]);
  }

  return (
    <div ref={ref} className={styles.wrapper} onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`filter-panel-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className={styles.trigger}
      >
        <span className={`${styles.triggerInner} ${open ? styles.triggerInnerActive : ""}`}>
          <span className={styles.filterLabel}>{label}</span>
          {count !== undefined && (
            <span className={styles.badge}>{count}</span>
          )}
          <svg
            width="16"
            height="16"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
          >
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="#5E5A4B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div
          id={`filter-panel-${label.toLowerCase().replace(/\s+/g, "-")}`}
          role="group"
          aria-label={`${label} filter options`}
          className={styles.panel}
        >
          {searchable && (
            <>
              <div className={styles.panelHeader}>
                <span className={styles.panelTitle}>
                  Filter {label.toLowerCase()}
                </span>
                {checked.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className={styles.clearLink}
                  >
                    Clear
                  </button>
                )}
              </div>
              <SearchInput
                placeholder=""
                value={search}
                onChange={setSearch}
              />
            </>
          )}
          <div className={scrollable ? styles.scrollList : undefined}>
            {filtered.map((item) => (
              <Checkbox
                key={item}
                label={item}
                checked={checked.includes(item)}
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
