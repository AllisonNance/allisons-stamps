"use client";

import styles from "./Checkbox.module.css";

interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Checkbox({
  label,
  checked = false,
  onChange,
}: CheckboxProps) {
  return (
    <label className={styles.label}>
      <span className={styles.checkboxWrap}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onChange?.(!checked);
            }
          }}
          className={styles.hiddenInput}
        />
        <span className={`${styles.box} ${checked ? styles.boxChecked : ""}`}>
          {checked && (
            <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 6L5 8.5L9.5 3.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </span>
      <span className={styles.text}>{label}</span>
    </label>
  );
}
