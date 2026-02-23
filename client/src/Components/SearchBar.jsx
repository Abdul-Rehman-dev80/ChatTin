import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";

export default function SearchBar({ onSearchChange }) {
  const [search, setSearch] = useState("");

  // Debounce: wait 500ms after user stops typing before updating search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, onSearchChange]);

  return (
    <div className="bg-slate-800 rounded-full py-2 px-4 flex justify-between items-center">
      <input
        className="bg-transparent outline-none text-white flex-1"
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search.trim() === "" && (
        <button className="text-slate-300 hover:text-white">
          <SearchIcon />
        </button>
      )}
    </div>
  );
}
