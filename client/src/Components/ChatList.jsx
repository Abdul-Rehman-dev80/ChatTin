import {
  getConversations,
  createConversation,
} from "../Services/conversationService";
import { getUsers } from "../Services/usersService";
import ChatCard from "./ChatCard";
import SearchBar from "./SearchBar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "./Loader";
import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";

export default function ChatList({
  onSelectConversation,
  selectedConversationId,
}) {
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  // Check if user is authenticated
  if (!currentUser) {
    return (
      <div className="bg-gray-700 w-full h-full flex items-center justify-center">
        <p className="text-gray-400">Please log in to view conversations</p>
      </div>
    );
  }

  // Fetch conversations
  const {
    data: conversations = [],
    isPending: conversationsLoading,
    error: conversationsError,
    isError: conversationsIsError,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Fetch users when searching
  const {
    data: usersData,
    isPending: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users", debouncedSearch],
    queryFn: () => getUsers({ search: debouncedSearch, pageParam: 1 }),
    enabled: debouncedSearch.trim().length > 0,
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      onSelectConversation?.(newConversation);
    },
  });

  // Helper: get other user from conversation
  const getOtherUser = (conversation) => {
    return conversation.users?.find((user) => user.id !== currentUser?.id);
  };

  // Helper: find conversation with a user
  const findConversationWithUser = (userId) => {
    return conversations.find((conv) => {
      const otherUser = getOtherUser(conv);
      return otherUser?.id === userId;
    });
  };

  // Handle user/conversation click
  const handleClick = async (user) => {
    if (user.id === currentUser?.id) return;

    const existingConv = findConversationWithUser(user.id);
    if (existingConv) {
      onSelectConversation?.(existingConv);
    } else {
      createConversationMutation.mutate(user.id);
    }
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Get display items (conversations or search results)
  const getDisplayItems = () => {
    if (debouncedSearch.trim().length === 0) {
      // Show all conversations
      return conversations.map((conv) => ({
        type: "conversation",
        conversation: conv,
        user: getOtherUser(conv),
      }));
    }

    // Show search results (users)
    const searchUsers = usersData?.users || [];
    return searchUsers
      .filter((user) => user.id !== currentUser?.id)
      .map((user) => ({
        type: "user",
        user,
        conversation: findConversationWithUser(user.id),
      }));
  };

  const displayItems = getDisplayItems();
  // Only show loading for conversations initially, or users when searching
  const isLoading =
    conversationsLoading ||
    (debouncedSearch.trim().length > 0 && usersLoading && !usersData);

  return (
    <div className="bg-gray-700 w-full h-full flex flex-col">
      <div className="px-2 py-2">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          ChatTin
        </h1>
        <SearchBar onSearchChange={setDebouncedSearch} />
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="flex flex-col">
          {conversationsIsError && (
            <div className="text-red-500 text-center text-sm p-4">
              <p>Error loading conversations</p>
              <p className="text-xs mt-1">
                {conversationsError?.message || "Unknown error"}
              </p>
            </div>
          )}
          {usersError && (
            <p className="text-red-500 text-center text-sm p-2">
              Search error: {usersError.message}
            </p>
          )}
          {isLoading ? (
            <Loader />
          ) : conversationsIsError ? (
            <p className="text-gray-400 text-center p-4">
              Failed to load conversations. Please refresh the page.
            </p>
          ) : displayItems.length > 0 ? (
            displayItems.map((item) => {
              const user = item.user || getOtherUser(item.conversation);
              if (!user) return null;

              const conversation = item.conversation;
              const isSelected = conversation?.id === selectedConversationId;

              return (
                <div
                  key={conversation?.id || user.id}
                  onClick={() => handleClick(user)}
                  className={isSelected ? "bg-gray-800" : ""}
                >
                  <ChatCard
                    details={{
                      pfp: user.pfp,
                      username: user.username || user.phone || "Unknown",
                      lastMessage: conversation
                        ? ""
                        : "Click to start conversation",
                      time: conversation
                        ? formatTime(conversation.updatedAt)
                        : "",
                    }}
                  />
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-center">
              {debouncedSearch ? "No users found" : "No conversations yet"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
