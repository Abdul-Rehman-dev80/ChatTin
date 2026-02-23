import { SERVER_URL } from "../Services/axiosInstance.js";
import { useChat } from "../Contexts/ChatContext.jsx";
import { useQuery } from "@tanstack/react-query";
import { getConversations } from "../Services/conversationService.js";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function OtherUserProfile() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { selectedConversationId } = useChat();

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

  if (!otherUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900 text-slate-400">
        <p className="mb-4">No user selected</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm"
        >
          Back to chats
        </button>
      </div>
    );
  }

  const avatar =
    otherUser?.pfp && otherUser.pfp !== "defaultPfp.png"
      ? `${SERVER_URL}/${otherUser.pfp}`
      : "/defaultPfp.png";

  const valueClass =
    "w-full bg-slate-700/80 text-white border border-slate-600 rounded-lg px-4 py-2.5 text-sm";

  return (
    <div className="flex-1 flex flex-col items-center p-8 bg-slate-900 relative">
      <button
        onClick={() => navigate(-1)}
        className="p-2 -ml-2 mr-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300 absolute top-4 left-4 cursor-pointer"
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
            <span className="block text-sm font-medium text-slate-400 mb-1.5">
              Username
            </span>
            <p className={valueClass}>{otherUser.username ?? "—"}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-slate-400 mb-1.5">
              Email
            </span>
            <p className={valueClass}>{otherUser.email ?? "—"}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-slate-400 mb-1.5">
              Phone
            </span>
            <p className={valueClass}>{otherUser.phone ?? "—"}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-slate-400 mb-1.5">
              About
            </span>
            <p className={valueClass}>{otherUser.about ?? ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
