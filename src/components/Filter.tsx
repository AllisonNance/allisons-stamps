"use client";

import { useState } from "react";

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
      className={`
        group inline-flex items-center gap-2 px-3 py-2
        bg-[var(--background)] text-[#5E5A4B]
        border-b-2 transition-all outline-none
        focus-visible:ring-2 focus-visible:ring-[var(--color-border)]
        ${isSelected
          ? "border-[#8E8A7C]"
          : "border-transparent hover:border-[#8E8A7C]"
        }
      `}
    >
      <span className="text-lg font-medium" style={{ fontSize: 18 }}>{label}</span>
      {count !== undefined && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-icon)] text-[10px] font-semibold text-[var(--color-text-reverse)]">
          {count}
        </span>
      )}
      <svg
        width="16"
        height="16"
        viewBox="0 0 12 12"
        fill="none"
        className={`transition-transform ${isSelected ? "rotate-180" : ""}`}
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
