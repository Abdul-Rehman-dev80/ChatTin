import { useRef, useEffect } from "react";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { useCall } from "../Contexts/CallContext";
import { useWebRTC } from "../Hooks/useWebRTC";

export default function ActiveCall() {
  const {
    remoteUser,
    isVideo,
    isInitiator,
    localStreamRef,
    remoteStream,
    setRemoteStream,
    endCall,
  } = useCall();

  const { isConnecting, error } = useWebRTC({
    remoteUserId: remoteUser?.id,
    isInitiator,
    isVideo,
    setRemoteStream,
    localStreamRef,
  });

  const localVideoRef = useRef(null);

  // Attach local stream to video element when it's ready
  useEffect(() => {
    if (!localVideoRef.current || !localStreamRef?.current) return;
    localVideoRef.current.srcObject = localStreamRef.current;
  }, [isConnecting, localStreamRef?.current]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900">
      {/* Header with name and hang up */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-600">
        <p className="text-white font-medium">
          {remoteUser?.name ?? "In call"}
        </p>
        <button
          onClick={endCall}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
          aria-label="End call"
        >
          <CallEndIcon />
          Hang up
        </button>
      </div>

      {/* Video area */}
      <div className="flex-1 flex flex-col md:flex-row gap-2 p-4 min-h-0">
        {/* Remote video (full size when only one, or main area) */}
        <div className="flex-1 min-h-0 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center">
          {remoteStream ? (
            <video
              autoPlay
              playsInline
              className="w-full h-full object-contain"
              ref={(el) => {
                if (el) el.srcObject = remoteStream;
              }}
            />
          ) : (
            <p className="text-slate-400">
              {isConnecting ? "Connecting..." : "Waiting for video..."}
            </p>
          )}
        </div>

        {/* Local video (small preview) */}
        <div className="w-full md:w-48 h-36 md:h-32 rounded-lg overflow-hidden bg-slate-800 border-2 border-slate-600 shrink-0">
          {isVideo ? (
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
              You (audio only)
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-center py-2 text-sm">{error}</p>
      )}
    </div>
  );
}
