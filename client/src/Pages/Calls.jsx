import { useQuery } from "@tanstack/react-query";
import { getCalls } from "../Services/callService";
import { useAuth } from "../Contexts/AuthContext";
import { SERVER_URL } from "../Services/axiosInstance";
import Loader from "../Components/Loader";

function formatTime(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString();
}

function getDuration(startedAt, endedAt) {
  if (!endedAt) return null;
  const sec = Math.round((new Date(endedAt) - new Date(startedAt)) / 1000);
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

export default function Calls() {
  const { currentUser } = useAuth();
  const { data: calls = [], isPending, isError } = useQuery({
    queryKey: ["calls"],
    queryFn: getCalls,
  });

  if (isPending) return <Loader />;

  return (
    <div className="bg-slate-700 w-full h-full flex flex-col">
      <h1 className="text-2xl font-bold text-white text-center py-4">Call history</h1>
      <div className="flex-1 overflow-y-auto p-2">
        {isError && (
          <p className="text-red-500 text-center">Failed to load calls</p>
        )}
        {!isError && calls.length === 0 && (
          <p className="text-slate-400 text-center">No calls yet</p>
        )}
        {!isError &&
          calls.map((call) => {
            const isOutgoing = call.callerUserId === currentUser?.id;
            const other = isOutgoing ? call.callee : call.caller;
            const name = other?.username || other?.phone || "Unknown";
            const pfp = other?.pfp;
            const avatar =
              pfp && pfp !== "defaultPfp.png"
                ? `${SERVER_URL}/${pfp}`
                : "/defaultPfp.png";
            const duration = getDuration(call.startedAt, call.endedAt);
            const time = formatTime(call.startedAt);

            return (
              <div
                key={call.id}
                className="flex items-center px-3 py-2 bg-slate-600 rounded-lg mb-1"
              >
                <img
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-500 shrink-0"
                  src={avatar}
                  alt=""
                />
                <div className="flex flex-col flex-1 min-w-0 ml-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-white truncate">
                      {name}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">{time}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {isOutgoing ? "Outgoing" : "Incoming"} ·{" "}
                    {call.status === "ended"
                      ? duration || "—"
                      : call.status}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
