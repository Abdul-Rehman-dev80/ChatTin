import { useEffect, useRef, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useChat } from "../Contexts/ChatContext";
import { useCall } from "../Contexts/CallContext";
import { SERVER_URL } from "../Services/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../Services/messageService";
import { getConversations } from "../Services/conversationService";
import { socket } from "../Services/socketService";
import Loader from "./Loader";

/** Turns lastSeen date into a short "2h ago" / "yesterday" style string */
function formatLastSeen(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function OpenedChat() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { selectedConversationId, setSelectedConversationId } = useChat();
  const { startCall } = useCall();
  const [newMessage, setNewMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const bottomRef = useRef(null);
  const menuRef = useRef(null);

  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    retry: false,
    refetchInterval: selectedConversationId ? 30_000 : false, // refresh online/lastSeen every 30s
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

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  function handleSend(msg) {
    if (!msg.trim() || !conversationId) return;
    sendMessageMutation.mutate({ conversationId, body: msg });
    setNewMessage("");
  }

  if (!selectedConversationId) {
    return (
      <div className="bg-slate-800 w-full flex flex-col h-screen items-center justify-center">
        <p className="text-slate-400 text-lg">Select a conversation to start chatting</p>
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

  const displayName = otherUser?.username || otherUser?.phone || "Unknown User";

  // Status line: Online or Last seen ...
  const statusText = otherUser?.isOnline
    ? "Online"
    : otherUser?.lastSeen
      ? `Last seen ${formatLastSeen(otherUser.lastSeen)}`
      : "Offline";

  function handleClickProfile() {
    setMenuOpen(false);
    navigate("/otherUserProfile");
  }

  function handleSearchInChat() {
    setMenuOpen(false);
    toast.info("Search in chat coming soon");
  }

  if (isPending) return <Loader />;

  return (
    <div className="bg-slate-800 w-full flex flex-col h-screen">
      {/* Chat Header */}
      <div className="flex items-center h-18 px-4 border-b border-slate-600 bg-slate-800">
        <button
          onClick={() => setSelectedConversationId(null)}
          className="md:hidden p-2 -ml-2 mr-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300"
          aria-label="Back to chats"
        >
          <ArrowBackIcon />
        </button>
        <div className="relative shrink-0">
          <img
            className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
            src={avatarUrl}
            alt={`${displayName} avatar`}
          />
        </div>

        <div
          onClick={handleClickProfile}
          className="flex flex-col flex-1 min-w-0 ml-3 cursor-pointer hover:opacity-90"
        >
          <h3 className="text-base font-semibold text-white truncate">
            {displayName}
          </h3>
          <span className="text-xs text-slate-400">{statusText}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => startCall(conversationId, otherUser, false)}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300"
            aria-label="Voice call"
          >
            <CallIcon />
          </button>
          <button
            onClick={() => startCall(conversationId, otherUser, true)}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300"
            aria-label="Video call"
          >
            <VideocamIcon />
          </button>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
            aria-label="More options"
            aria-expanded={menuOpen}
          >
            <MoreVertIcon className="text-slate-300" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 py-1 w-44 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-10">
              <button
                onClick={handleClickProfile}
                className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-600 transition-colors"
              >
                <PersonIcon fontSize="small" />
                View profile
              </button>
              <button
                onClick={handleSearchInChat}
                className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-600 transition-colors"
              >
                <SearchIcon fontSize="small" />
                Search in chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-slate-900 p-4">
        <div className="flex flex-col gap-3">
          {!isPending && (!data || data.length === 0) && (
            <p className="text-slate-500 text-center py-8">
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
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-700 text-slate-100"
                }`}
              >
                <p className="text-sm wrap-break-words">{msg.body}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.senderId === currentUser.id
                      ? "text-cyan-100"
                      : "text-slate-400"
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
      <div className="flex items-center p-4 border-t border-slate-600 bg-slate-800">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSend(newMessage);
          }}
          type="text"
          className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-400"
          placeholder="Type a message..."
        />
        <button
          onClick={() => handleSend(newMessage)}
          className="ml-3 p-3 bg-cyan-600 hover:bg-cyan-700 rounded-full transition-colors text-white"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}
