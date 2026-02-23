import { useEffect, useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../Contexts/AuthContext";
import { useChat } from "../Contexts/ChatContext";
import { SERVER_URL } from "../Services/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../Services/messageService";
import { getConversations } from "../Services/conversationService";
import { socket } from "../Services/socketService";
import Loader from "./Loader";

export default function OpenedChat() {
  const { currentUser } = useAuth();
  const { selectedConversationId } = useChat();
  const [newMessage, setNewMessage] = useState("");

  const bottomRef = useRef(null);

  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    retry: false,
  });
  const selectedConversation = selectedConversationId != null
    ? conversations.find((c) => c.id === selectedConversationId || c.id === Number(selectedConversationId))
    : null;
  const conversationId = selectedConversation?.id != null ? String(selectedConversation.id) : null;

  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
  });

  // When we load messages we've "read" the chat — refresh list so unread dot updates
  useEffect(() => {
    if (conversationId && data) {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  }, [conversationId, data, queryClient]);

  const sendMessageMutation = useMutation({
    mutationFn: ({ conversationId, body }) => sendMessage(conversationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [selectedConversationId, data]);

  // Join conversation room for real-time messages; leave when switching or unmounting
  useEffect(() => {
    if (!conversationId) return;
    socket.emit("join_conversation", conversationId);
    return () => {
      socket.emit("leave_conversation", conversationId);
    };
  }, [conversationId]);

  // Listen for new messages in this conversation and refresh the list
  useEffect(() => {
    const onNewMessage = (message) => {
      if (String(message.conversationId) === conversationId) {
        queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      }
    };
    socket.on("new_message", onNewMessage);
    return () => socket.off("new_message", onNewMessage);
  }, [conversationId, queryClient]);

  function handleSend(msg) {
    if (!msg.trim() || !conversationId) return;
    sendMessageMutation.mutate({ conversationId, body: msg });
    setNewMessage("");
  }

  if (!selectedConversationId) {
    return (
      <div className="bg-gray-800 w-full flex flex-col h-screen items-center justify-center">
        <p className="text-gray-400 text-lg">Select a conversation to start chatting</p>
      </div>
    );
  }
  if (!selectedConversation) return <Loader />;

  // Get the other user in the conversation (not the current user)
  const otherUser = selectedConversation.users?.find(
    (user) => user.id !== currentUser?.id,
  );

  // Get avatar URL
  const avatarUrl =
    otherUser?.pfp && otherUser.pfp !== "defaultPfp.png"
      ? `${SERVER_URL}/${otherUser.pfp}`
      : "/defaultPfp.png";

  // Get username or fallback to phone number
  const displayName = otherUser?.username || otherUser?.phone || "Unknown User";

  if (isPending) return <Loader />;

  return (
    <div className="bg-gray-800 w-full flex flex-col h-screen">
      {/* Chat Header */}
      <div className="flex items-center h-18 px-4 border-b border-gray-700 bg-gray-800">
        <div className="relative shrink-0">
          <img
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
            src={avatarUrl}
            alt={`${displayName} avatar`}
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0 ml-3">
          <h3 className="text-base font-semibold text-white truncate">
            {displayName}
          </h3>
          <span className="text-xs text-gray-400">
            {otherUser?.isOnline ? "Online" : "Offline"}
          </span>
        </div>
        <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
          <MoreVertIcon className="text-gray-300" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-900 p-4">
        <div className="flex flex-col gap-3">
          {!isPending && (!data || data.length === 0) && (
            <p className="text-gray-500 text-center py-8">
              No messages yet. Say hi!
            </p>
          )}
          {data?.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  msg.senderId === currentUser.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                <p className="text-sm wrap-break-words">{msg.body}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.senderId === currentUser.id
                      ? "text-blue-100"
                      : "text-gray-400"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
          {isError && <p className="text-red-500">Error loading messages</p>}
        </div>
      </div>

      {/* Message Input */}
      <div className="flex items-center p-4 border-t border-gray-700 bg-gray-800">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSend(newMessage);
          }}
          type="text"
          className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          placeholder="Type a message..."
        />
        <button
          onClick={() => handleSend(newMessage)}
          className="ml-3 p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors text-white"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}
