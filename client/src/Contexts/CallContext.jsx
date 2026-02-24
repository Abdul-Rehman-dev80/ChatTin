import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import {
  setupCallListeners,
  emitCallInitiate,
  emitCallAccept,
  emitCallReject,
  emitCallEnd,
} from "../Services/callSignaling";

const CallContext = createContext();

/** Call status: idle, outgoing ring, incoming ring, or active call */
const CALL_STATUS = {
  IDLE: "idle",
  RINGING_OUT: "ringing-out",
  RINGING_IN: "ringing-in",
  IN_CALL: "in-call",
};

export function CallProvider({ children }) {
  const { currentUser } = useAuth();

  const [callStatus, setCallStatus] = useState(CALL_STATUS.IDLE);
  const [conversationId, setConversationId] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [isInitiator, setIsInitiator] = useState(false);
  const [remoteUser, setRemoteUser] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  /** Remote media stream (set by useWebRTC when the other peer's track arrives) */
  const [remoteStream, setRemoteStream] = useState(null);

  // Refs for Phase 3 (WebRTC): the hook will set these when setting up the peer connection
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const resetCallState = useCallback(() => {
    setCallStatus(CALL_STATUS.IDLE);
    setConversationId(null);
    setIsVideo(false);
    setIsInitiator(false);
    setRemoteUser(null);
    setIncomingCall(null);
    setRemoteStream(null);
  }, []);

  // ---- Actions ----

  /**
   * Start a call (you are the caller).
   * @param {string} convId - Conversation id
   * @param {{ id: number, name: string }} otherUser - The user you're calling
   * @param {boolean} video - true for video call, false for voice only
   */
  const startCall = useCallback(
    (convId, otherUser, video) => {
      if (!otherUser?.id || !convId) return;
      const callerName = currentUser?.name ?? currentUser?.username ?? "Someone";
      emitCallInitiate({
        conversationId: String(convId),
        targetUserId: otherUser.id,
        isVideo: Boolean(video),
        callerName,
      });
      setCallStatus(CALL_STATUS.RINGING_OUT);
      setConversationId(String(convId));
      setIsVideo(Boolean(video));
      setIsInitiator(true);
      setRemoteUser({ id: otherUser.id, name: otherUser.name ?? otherUser.username ?? "User" });
      setIncomingCall(null);
    },
    [currentUser?.name, currentUser?.username]
  );

  /**
   * Accept an incoming call (you are the callee).
   * Call this when callStatus is "ringing-in" and incomingCall is set.
   */
  const acceptCall = useCallback(() => {
    if (!incomingCall) return;
    emitCallAccept({
      conversationId: incomingCall.conversationId,
      callerUserId: incomingCall.callerUserId,
    });
    setCallStatus(CALL_STATUS.IN_CALL);
    setRemoteUser({
      id: incomingCall.callerUserId,
      name: incomingCall.callerName ?? "User",
    });
    setIncomingCall(null);
  }, [incomingCall]);

  /**
   * Reject an incoming call.
   */
  const rejectCall = useCallback(() => {
    if (!incomingCall) return;
    emitCallReject({
      conversationId: incomingCall.conversationId,
      callerUserId: incomingCall.callerUserId,
    });
    resetCallState();
  }, [incomingCall, resetCallState]);

  /**
   * End the call (either side). Use when ringing-out, ringing-in, or in-call.
   */
  const endCall = useCallback(() => {
    const targetId =
      callStatus === CALL_STATUS.RINGING_IN
        ? incomingCall?.callerUserId
        : remoteUser?.id;
    const convId = callStatus === CALL_STATUS.RINGING_IN
      ? incomingCall?.conversationId
      : conversationId;
    if (targetId && convId) {
      emitCallEnd({ conversationId: String(convId), targetUserId: targetId });
    }
    resetCallState();
  }, [callStatus, incomingCall, remoteUser, conversationId, resetCallState]);

  // ---- Socket listeners: react to incoming call events ----

  useEffect(() => {
    if (!currentUser?.id) return;

    const cleanup = setupCallListeners({
      onIncomingCall: (payload) => {
        setIncomingCall({
          conversationId: payload.conversationId,
          callerUserId: payload.callerUserId,
          callerName: payload.callerName,
          isVideo: payload.isVideo,
        });
        setCallStatus(CALL_STATUS.RINGING_IN);
        setConversationId(payload.conversationId);
        setIsVideo(Boolean(payload.isVideo));
        setIsInitiator(false);
        setRemoteUser(null);
      },
      onCallAccepted: () => {
        setCallStatus(CALL_STATUS.IN_CALL);
      },
      onCallRejected: () => {
        resetCallState();
      },
      onCallEnded: () => {
        resetCallState();
      },
    });

    return cleanup;
  }, [currentUser?.id, resetCallState]);

  const value = {
    // State
    callStatus,
    conversationId,
    isVideo,
    isInitiator,
    remoteUser,
    incomingCall,
    remoteStream,
    // Refs for WebRTC (Phase 3)
    localStreamRef,
    peerConnectionRef,
    // Actions
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    // Constants for easy checks
    CALL_STATUS,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}

export function useCall() {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error("useCall must be used inside CallProvider");
  return ctx;
}