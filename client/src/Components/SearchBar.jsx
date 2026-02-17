import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { searchUser } from "../Services/usersService";
import { useQuery } from "@tanstack/react-query";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["searchResults", debouncedSearch],
    queryFn: () => searchUser(debouncedSearch, debouncedSearch),
    enabled: debouncedSearch.trim() !== "",
  });

  console.log("Search results:", data);

  return (
    <div className="bg-gray-800 rounded-full py-2 px-4 flex justify-between items-center">
      <input
        className="bg-transparent outline-none text-white"
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search.trim() === "" && (
        <button className="text-gray-300 hover:text-white">
          <SearchIcon />
        </button>
      )}
    </div>
  );
}
