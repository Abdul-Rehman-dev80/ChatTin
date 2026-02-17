import { getUsers } from "../Services/usersService";
import ChatCard from "./ChatCard";
import SearchBar from "./SearchBar";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loader from "./Loader";
import { useState } from "react";

export default function MessageList() {
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Fetch users with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    error,
  } = useInfiniteQuery({
    queryKey: ["users", debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      getUsers({ search: debouncedSearch, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // If there are more pages, return next page number
      return lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined;
    },
  });

  // Combine all pages into one array of users
  const allUsers = data?.pages.flatMap((page) => page.users) || [];

  return (
    <div className="bg-gray-700 w-[50%] min-w-[270px] flex flex-col border-r border-gray-600">
      <div className="px-2 py-2">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          ChatTin
        </h1>
        <SearchBar onSearchChange={setDebouncedSearch} />
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="flex flex-col">
          {isPending ? (
            <Loader />
          ) : error ? (
            <p className="text-red-500 text-center">
              Error loading users: {error.message}
            </p>
          ) : allUsers.length > 0 ? (
            allUsers.map((user, index) => (
              <ChatCard
                key={user.id || index}
                details={{
                  pfp: user?.pfp,
                  username: user?.username,
                  lastMessage: "Last message",
                  time: "2:30 PM",
                }}
              />
            ))
          ) : (
            <p className="text-gray-400 text-center">No users found</p>
          )}
        </div>
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-blue-400 p-2 text-sm"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </button>
        )}
      </div>
    </div>
  );
}
