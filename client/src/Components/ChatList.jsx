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
import { useChat } from "../Contexts/ChatContext";

export default function ChatList() {
  const [search, setSearch] = useState("");
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const {
    setSelectedConversationId,
    selectedConversationId,
    setIsCreatingConversation,
  } = useChat();

  // Fetch conversations (shown when search is empty)
  const {
    data: conversations = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    retry: false,
  });

  // Search users (when user types in search box)
  const { data: usersData } = useQuery({
    queryKey: ["users", search],
    queryFn: () => getUsers({ search }),
    enabled: search.trim().length > 0,
  });

  // Create a new conversation when user clicks someone from search.
  // If they already have a chat, the API returns that one. Then we open it in OpenedChat.
  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onMutate: () => setIsCreatingConversation(true),
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setSelectedConversationId(conversation.id);
    },
    onSettled: () => setIsCreatingConversation(false),
  });

  // User clicked someone from search → create (or get) conversation and open it
  const handleClickUser = (user) => {
    if (user.id === currentUser.id) return;
    createConversationMutation.mutate({ otherUserId: user.id });
  };

  const handleSelectExistingConversation = (conversation) => {
    setSelectedConversationId(conversation.id);
  };

  const items =
    search.trim().length === 0
      ? conversations
      : (usersData?.users || []).filter((u) => u.id !== currentUser.id);

  if (isPending) return <Loader />;

  return (
    <div className="bg-slate-700 w-full h-full flex flex-col">
      <div className="p-2">
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          ChatTin
        </h1>
        <SearchBar onSearchChange={setSearch} />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {items.length === 0 ? (
          <p className="text-slate-400 text-center">
            {search ? "No users found" : "No conversations yet"}
          </p>
        ) : (
          items.map((item) => {
            const isConversation = search.trim().length === 0;
            const user = isConversation
              ? item.users.find((u) => u.id !== currentUser.id)
              : item;

            const isSelected =
              isConversation && item.id === selectedConversationId;

            return (
              <div
                key={isConversation ? item.id : user.id}
                onClick={() =>
                  isConversation
                    ? handleSelectExistingConversation(item)
                    : handleClickUser(user)
                }
              >
                <ChatCard
                  details={{
                    pfp: user?.pfp,
                    username: user?.username || user?.phone,
                    lastMessage: isConversation
                      ? ""
                      : "Click to start conversation",
                    time: isConversation
                      ? new Date(item.updatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "",
                    hasUnread: isConversation ? item.hasUnread : false,
                    isSelected,
                  }}
                />
              </div>
            );
          })
        )}
        {isError && (
          <p className="text-red-500 text-center">
            Error loading conversations
          </p>
        )}
      </div>
    </div>
  );
}
