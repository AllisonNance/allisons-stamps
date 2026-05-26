"use client";

import { useState } from "react";
import Checkbox from "./Checkbox";
import SearchInput from "./SearchInput";
import styles from "./CheckboxGroup.module.css";

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
    <div className={styles.wrapper}>
      {label && (
        <h3 className={styles.heading}>{label}</h3>
      )}
      {searchable && (
        <SearchInput
          placeholder={`Filter ${label?.toLowerCase() ?? "items"}`}
          value={search}
          onChange={setSearch}
        />
      )}
      <div className={`${styles.list} ${scrollable ? styles.listScrollable : ""}`}>
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
  );
}
