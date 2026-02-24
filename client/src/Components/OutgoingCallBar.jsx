import { useCall } from "../Contexts/CallContext";

export default function OutgoingCallBar() {
  const { remoteUser, isVideo, endCall } = useCall();

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 mx-4 md:mx-auto md:max-w-md flex items-center justify-between bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 shadow-lg">
      <p className="text-slate-200">
        Calling {remoteUser?.name ?? "..."} ({isVideo ? "video" : "voice"})
      </p>
      <button
        onClick={endCall}
        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
