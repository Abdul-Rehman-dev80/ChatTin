import { useState } from "react";
import { SERVER_URL } from "../Services/axiosInstance.js";
import { useChat } from "../Contexts/ChatContext.jsx";
import { useQuery } from "@tanstack/react-query";
import { getConversations } from "../Services/conversationService.js";
import { useAuth } from "../Contexts/AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function OtherUserProfile() {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", about: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { selectedConversationId, setSelectedConversationId } = useChat();

  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    retry: false,
  });

  const selectedConversation =
    selectedConversationId != null
      ? conversations.find(
          (c) =>
            c.id === selectedConversationId ||
            c.id === Number(selectedConversationId),
        )
      : null;

  const otherUser = selectedConversation?.users?.find(
    (user) => user.id !== currentUser?.id,
  );

  const avatar =
    otherUser?.pfp && otherUser.pfp !== "defaultPfp.png"
      ? `${SERVER_URL}/${otherUser.pfp}`
      : "/defaultPfp.png";

  const inputClass =
    "w-full bg-slate-700/80 text-white border border-slate-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 placeholder-slate-500";

  return (
    <div className="flex-1 flex flex-col items-center p-8 bg-slate-900 relative">
      <button
        onClick={() => {
          window.history.back();
        }}
        className="p-2 -ml-2 mr-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300 absolute top-4 left-4"
        aria-label="Back to chat"
      >
        <ArrowBackIcon />
      </button>
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <img
            className="w-24 h-24 rounded-full object-cover ring-2 ring-slate-600"
            src={avatar}
            alt="Profile"
          />
        </div>
        <div className="w-full space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-400 mb-1.5"
            >
              Username
            </label>
            <input
              className={inputClass}
              type="text"
              id="username"
              value={otherUser?.username ?? "—"}
              readOnly
              disabled
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-400 mb-1.5"
            >
              Email
            </label>
            <input
              className={inputClass}
              type="text"
              id="email"
              value={otherUser?.email ?? "—"}
              readOnly
              disabled
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-slate-400 mb-1.5"
            >
              Phone
            </label>
            <input
              className={inputClass}
              type="text"
              id="phone"
              value={otherUser?.phone ?? "—"}
              readOnly
              disabled
            />
          </div>
          <div>
            <label
              htmlFor="about"
              className="block text-sm font-medium text-slate-400 mb-1.5"
            >
              About
            </label>
            <input
              className={inputClass}
              type="text"
              id="about"
              value={otherUser?.about ?? ""}
              readOnly
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}
