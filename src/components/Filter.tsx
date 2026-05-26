"use client";

import { useState } from "react";
import styles from "./Filter.module.css";

interface FilterProps {
  label: string;
  count?: number;
  selected?: boolean;
  onToggle?: (selected: boolean) => void;
}

export default function Filter({
  label,
  count,
  selected = false,
  onToggle,
}: FilterProps) {
  const [isSelected, setIsSelected] = useState(selected);

  function handleClick() {
    const next = !isSelected;
    setIsSelected(next);
    onToggle?.(next);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.button} ${isSelected ? styles.buttonSelected : ""}`}
    >
      <span className={styles.label}>{label}</span>
      {count !== undefined && (
        <span className={styles.badge}>{count}</span>
      )}
      <svg
        width="16"
        height="16"
        viewBox="0 0 12 12"
        fill="none"
        className={`${styles.chevron} ${isSelected ? styles.chevronOpen : ""}`}
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
  );
}
