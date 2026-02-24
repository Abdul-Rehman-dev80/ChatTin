import { useCall } from "../Contexts/CallContext";

export default function IncomingCallModal() {
  const { incomingCall, acceptCall, rejectCall } = useCall();

  if (!incomingCall) return null;

  const isVideo = incomingCall.isVideo;
  const callerName = incomingCall.callerName ?? "Someone";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-600 shadow-xl max-w-sm w-full p-6 text-center">
        <p className="text-slate-300 text-lg mb-1">
          Incoming {isVideo ? "video" : "voice"} call
        </p>
        <p className="text-white font-semibold text-xl mb-6">{callerName}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={rejectCall}
            className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
          >
            Reject
          </button>
          <button
            onClick={acceptCall}
            className="px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
