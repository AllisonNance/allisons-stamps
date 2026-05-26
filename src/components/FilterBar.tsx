"use client";

import { useState } from "react";
import FilterDropdown from "./FilterDropdown";
import styles from "./FilterBar.module.css";

interface FilterConfig {
  label: string;
  items: string[];
}

interface FilterBarProps {
  filters: FilterConfig[];
  onChange?: (selections: Record<string, string[]>) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const [selections, setSelections] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(filters.map((f) => [f.label, []]))
  );
  const [resetKey, setResetKey] = useState(0);

  const hasAnySelected = Object.values(selections).some((s) => s.length > 0);

  function handleFilterChange(label: string, selected: string[]) {
    const next = { ...selections, [label]: selected };
    setSelections(next);
    onChange?.(next);
  }

  function handleClearAll() {
    const next = Object.fromEntries(filters.map((f) => [f.label, []]));
    setSelections(next);
    setResetKey((k) => k + 1);
    onChange?.(next);
  }

  return (
    <div className={styles.wrapper}>
      {filters.map((filter) => (
        <FilterDropdown
          key={`${filter.label}-${resetKey}`}
          label={filter.label}
          items={filter.items}
          onChange={(selected) => handleFilterChange(filter.label, selected)}
        />
      ))}
      {hasAnySelected && (
        <button
          type="button"
          onClick={handleClearAll}
          className={styles.clearButton}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
