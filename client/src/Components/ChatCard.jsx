import { SERVER_URL } from "../Services/axiosInstance.js";

export default function ChatCard({ details }) {
  if (!details) return null;

  const { pfp, username, lastMessage, time } = details;
  const avatar = pfp && pfp !== "defaultPfp.png" ? `${SERVER_URL}/${pfp}` : "/defaultPfp.png";

  return (
    <div className="flex items-center h-[72px] px-3 py-2 bg-gray-600 hover:bg-gray-800 active:bg-gray-800 rounded-lg cursor-pointer transition-colors mb-1">
      <div className="relative shrink-0">
        <img
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-500"
          src={avatar}
          alt={username ? `${username} avatar` : "User avatar"}
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0 ml-3">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="text-sm font-semibold text-white truncate">
            {username || "Unknown User"}
          </h3>
          {time && (
            <span className="text-xs font-medium text-gray-400 ml-2">
              {time}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-300 truncate pr-4">
            {lastMessage || ""}
          </p>
        </div>
      </div>
    </div>
  );
}
