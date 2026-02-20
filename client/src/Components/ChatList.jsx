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
  const [search, setSearch] = useState("");
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  // Fetch conversations
  const { data: conversations = [], isPending } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  // Search users
  const { data: usersData } = useQuery({
    queryKey: ["users", search],
    queryFn: () => getUsers({ search }),
    enabled: search.trim().length > 0,
  });

  // Create (or get existing) conversation
  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      onSelectConversation?.(conversation);
    },
  });

  const handleClick = (user) => {
    if (user.id === currentUser.id) return;

    createConversationMutation.mutate({
      otherUserId: user.id,
    });
  };

  const items =
    search.trim().length === 0
      ? conversations
      : (usersData?.users || []).filter(
          (u) => u.id !== currentUser.id
        );

  if (isPending) return <Loader />;

  return (
    <div className="bg-gray-700 w-full h-full flex flex-col">
      <div className="p-2">
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          ChatTin
        </h1>
        <SearchBar onSearchChange={setSearch} />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {items.length === 0 ? (
          <p className="text-gray-400 text-center">
            {search ? "No users found" : "No conversations yet"}
          </p>
        ) : (
          items.map((item) => {
            const isConversation = search.trim().length === 0;
            const user = isConversation
              ? item.users.find(
                  (u) => u.id !== currentUser.id
                )
              : item;

            const isSelected =
              isConversation &&
              item.id === selectedConversationId;

            return (
              <div
                key={isConversation ? item.id : user.id}
                onClick={() => handleClick(user)}
                className={isSelected ? "bg-gray-800" : ""}
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
                  }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
