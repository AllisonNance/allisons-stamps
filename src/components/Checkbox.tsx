"use client";

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
    <label className="flex items-center gap-3 cursor-pointer py-2 px-1 group">
      <span className="relative flex h-5 w-5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="peer"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
            borderWidth: 0,
          }}
        />
        <span
          className={`
            flex h-5 w-5 items-center justify-center rounded-sm border
            transition-colors
            ${checked
              ? "border-[var(--color-border)] bg-[var(--color-icon)]"
              : "border-[var(--color-border)] bg-white group-hover:bg-[rgba(153,144,112,0.25)]"
            }
            peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-border)] peer-focus-visible:ring-offset-1
          `}
        >
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
      <span className="text-[var(--color-text)]" style={{ fontSize: 16 }}>
        {label}
      </span>
    </label>
  );
}
