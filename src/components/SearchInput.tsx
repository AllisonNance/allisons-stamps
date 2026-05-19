"use client";

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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        border: "1.5px solid #8E8A7C",
        borderRadius: 0,
        backgroundColor: "#ffffff",
        padding: "10px 14px",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        style={{ flexShrink: 0 }}
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
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          fontSize: 16,
          color: "#323028",
        }}
      />
    </div>
  );
}
