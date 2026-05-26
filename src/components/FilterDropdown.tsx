"use client";

import { useState, useRef, useEffect } from "react";
import Checkbox from "./Checkbox";
import SearchInput from "./SearchInput";

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
  const [hoverLine, setHoverLine] = useState(false);
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
    <div ref={ref} style={{ position: "relative", display: "inline-block" }} onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`filter-panel-${label.toLowerCase().replace(/\s+/g, "-")}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          background: "var(--background)",
          color: "var(--color-text)",
          border: "none",
          cursor: "pointer",
        }}
        onMouseEnter={() => setHoverLine(true)}
        onMouseLeave={() => setHoverLine(false)}
      >
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          borderBottom: (open || hoverLine)
            ? "2px solid #8E8A7C"
            : "2px solid transparent",
          paddingBottom: 4,
          transition: "border-color 0.15s",
        }}>
        <span style={{ fontSize: 16, fontWeight: 300 }}>{label}</span>
        {count !== undefined && (
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
        <svg
          width="16"
          height="16"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          style={{
            transition: "transform 0.15s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
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
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            minWidth: 240,
            background: "#ffffff",
            border: "1px solid #E9E9E9",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            padding: 16,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {searchable && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 16, color: "#8E8A7C" }}>
                  Filter {label.toLowerCase()}
                </span>
                {checked.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 14,
                      color: "#5E5A4B",
                      textDecoration: "underline",
                      cursor: "pointer",
                      padding: 0,
                    }}
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
          <div
            style={scrollable ? {
              maxHeight: 320,
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#5E5A4B transparent",
            } : undefined}
          >
            {filtered.map((item) => (
              <Checkbox
                key={item}
                label={item}
                checked={checked.includes(item)}
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
