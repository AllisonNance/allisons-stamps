"use client";

import styles from "./SearchInput.module.css";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchInput({
  placeholder = "",
  value = "",
  onChange,
}: SearchInputProps) {
  return (
    <div className={styles.wrapper}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className={styles.icon}
      >
        <circle
          cx="8.5"
          cy="8.5"
          r="6"
          stroke="#999070"
          strokeWidth="2"
        />
        <path
          d="M13 13L17.5 17.5"
          stroke="#999070"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className={styles.input}
      />
    </div>
  );
}
