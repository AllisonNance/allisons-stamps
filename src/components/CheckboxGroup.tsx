"use client";

import { useState } from "react";
import Checkbox from "./Checkbox";
import SearchInput from "./SearchInput";

interface CheckboxGroupProps {
  label?: string;
  items: string[];
  selected?: string[];
  searchable?: boolean;
  onChange?: (selected: string[]) => void;
}

export default function CheckboxGroup({
  label,
  items,
  selected = [],
  searchable = false,
  onChange,
}: CheckboxGroupProps) {
  const [checked, setChecked] = useState<string[]>(selected);
  const [search, setSearch] = useState("");

  const filtered = search
    ? items.filter((item) => item.toLowerCase().includes(search.toLowerCase()))
    : items;
  const scrollable = filtered.length > 4;

  function handleChange(item: string, isChecked: boolean) {
    const next = isChecked
      ? [...checked, item]
      : checked.filter((i) => i !== item);
    setChecked(next);
    onChange?.(next);
  }

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <h3 style={{ fontSize: 24, color: "#8E8A7C", fontWeight: 400 }}>
          {label}
        </h3>
      )}
      {searchable && (
        <SearchInput
          placeholder={`Filter ${label?.toLowerCase() ?? "items"}`}
          value={search}
          onChange={setSearch}
        />
      )}
      <div
        className="flex flex-col gap-1"
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
  );
}
