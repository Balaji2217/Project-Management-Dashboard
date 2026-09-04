import { useRef } from "react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  const inputRef = useRef(null);

  return (
    <div className="search-bar">
      <span className="search-icon">⌕</span>

      <input
        ref={inputRef}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
      />

      {value && (
        <button
          className="search-clear"
          onClick={() => onChange("")}
        >
          ×
        </button>
      )}
    </div>
  );
}