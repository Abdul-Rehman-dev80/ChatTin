import { SERVER_URL } from "../Services/axiosInstance.js";

export default function ChatCard({ details }) {
  if (!details) return null;

  const { pfp, username, lastMessage, time, hasUnread } = details;
  const avatar = pfp && pfp !== "defaultPfp.png" ? `${SERVER_URL}/${pfp}` : "/defaultPfp.png";

  return (
    <div className="flex items-center h-[72px] px-3 py-2 bg-slate-600 hover:bg-slate-800 active:bg-slate-800 rounded-lg cursor-pointer transition-colors mb-1">
      <div className="relative shrink-0">
        <img
          className="w-12 h-12 rounded-full object-cover border-2 border-slate-500"
          src={avatar}
          alt={username ? `${username} avatar` : "User avatar"}
        />
        {hasUnread && (
          <span
            className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-600"
            aria-label="Unread messages"
          />
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0 ml-3">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="text-sm font-semibold text-white truncate">
            {username || "Unknown User"}
          </h3>
          {time && (
            <span className="text-xs font-medium text-slate-400 ml-2">
              {time}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-300 truncate pr-4">
            {lastMessage || ""}
          </p>
        </div>
      </div>
    </div>
  );
}
