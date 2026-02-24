/**
 * Call signaling for WebRTC using the existing Socket.io connection.
 * Use these functions to start/accept/reject/end calls and to exchange
 * WebRTC offer/answer/ICE with the other peer.
 */
import { socket } from "./socketService";

// ---------------------------------------------------------------------------
// Emit helpers: call these when you want to send something to the server
// ---------------------------------------------------------------------------

/**
 * Start a call (you are the caller).
 * @param {Object} params
 * @param {string} params.conversationId - Conversation id
 * @param {number} params.targetUserId - User id of the person you're calling
 * @param {boolean} params.isVideo - true for video call, false for voice only
 * @param {string} [params.callerName] - Your display name for the callee
 */
export function emitCallInitiate({ conversationId, targetUserId, isVideo, callerName }) {
  socket.emit("call:initiate", {
    conversationId,
    targetUserId,
    isVideo: Boolean(isVideo),
    callerName: callerName ?? "Someone",
  });
}

/**
 * Accept an incoming call (you are the callee).
 * @param {Object} params
 * @param {string} params.conversationId - Conversation id
 * @param {number} params.callerUserId - User id of the person who called you
 */
export function emitCallAccept({ conversationId, callerUserId }) {
  socket.emit("call:accept", { conversationId, callerUserId });
}

/**
 * Reject an incoming call.
 * @param {Object} params
 * @param {string} params.conversationId - Conversation id
 * @param {number} params.callerUserId - User id of the person who called you
 */
export function emitCallReject({ conversationId, callerUserId }) {
  socket.emit("call:reject", { conversationId, callerUserId });
}

/**
 * End the call (either side can call this).
 * @param {Object} params
 * @param {string} params.conversationId - Conversation id
 * @param {number} params.targetUserId - User id of the other person
 */
export function emitCallEnd({ conversationId, targetUserId }) {
  socket.emit("call:end", { conversationId, targetUserId });
}

/**
 * Send WebRTC SDP offer to the other peer (caller sends after call is accepted).
 * @param {Object} params
 * @param {number} params.targetUserId - Other user's id
 * @param {RTCSessionDescriptionInit} params.offer - The offer from createOffer()
 */
export function emitOffer({ targetUserId, offer }) {
  socket.emit("webrtc:offer", { targetUserId, offer });
}

/**
 * Send WebRTC SDP answer to the other peer (callee sends after accepting).
 * @param {Object} params
 * @param {number} params.targetUserId - Other user's id (the caller)
 * @param {RTCSessionDescriptionInit} params.answer - The answer from createAnswer()
 */
export function emitAnswer({ targetUserId, answer }) {
  socket.emit("webrtc:answer", { targetUserId, answer });
}

/**
 * Send an ICE candidate to the other peer.
 * @param {Object} params
 * @param {number} params.targetUserId - Other user's id
 * @param {RTCIceCandidateInit} params.candidate - The ICE candidate
 */
export function emitIceCandidate({ targetUserId, candidate }) {
  socket.emit("webrtc:ice-candidate", { targetUserId, candidate });
}

// ---------------------------------------------------------------------------
// Listeners: call setupCallListeners once (e.g. in your CallProvider) and
// pass an object with the callbacks you want. Unsubscribe with the returned function.
// ---------------------------------------------------------------------------

/**
 * Subscribe to all call-related events. Call the returned function to remove all listeners.
 * @param {Object} handlers - Your callback functions (any can be omitted)
 * @param {function(Object): void} [handlers.onIncomingCall] - (payload) => {}  payload: { conversationId, callerUserId, callerName, isVideo }
 * @param {function(Object): void} [handlers.onCallAccepted] - (payload) => {}  payload: { conversationId, calleeUserId }
 * @param {function(Object): void} [handlers.onCallRejected] - (payload) => {}  payload: { conversationId }
 * @param {function(Object): void} [handlers.onCallEnded] - (payload) => {}  payload: { conversationId }
 * @param {function(Object): void} [handlers.onOffer] - (payload) => {}  payload: { offer }
 * @param {function(Object): void} [handlers.onAnswer] - (payload) => {}  payload: { answer }
 * @param {function(Object): void} [handlers.onIceCandidate] - (payload) => {}  payload: { candidate }
 * @returns {function(): void} - Call this to remove all these listeners
 */
export function setupCallListeners(handlers) {
  const {
    onIncomingCall,
    onCallAccepted,
    onCallRejected,
    onCallEnded,
    onOffer,
    onAnswer,
    onIceCandidate,
  } = handlers ?? {};

  if (onIncomingCall) socket.on("call:incoming", onIncomingCall);
  if (onCallAccepted) socket.on("call:accepted", onCallAccepted);
  if (onCallRejected) socket.on("call:rejected", onCallRejected);
  if (onCallEnded) socket.on("call:ended", onCallEnded);
  if (onOffer) socket.on("webrtc:offer", onOffer);
  if (onAnswer) socket.on("webrtc:answer", onAnswer);
  if (onIceCandidate) socket.on("webrtc:ice-candidate", onIceCandidate);

  return function cleanup() {
    if (onIncomingCall) socket.off("call:incoming", onIncomingCall);
    if (onCallAccepted) socket.off("call:accepted", onCallAccepted);
    if (onCallRejected) socket.off("call:rejected", onCallRejected);
    if (onCallEnded) socket.off("call:ended", onCallEnded);
    if (onOffer) socket.off("webrtc:offer", onOffer);
    if (onAnswer) socket.off("webrtc:answer", onAnswer);
    if (onIceCandidate) socket.off("webrtc:ice-candidate", onIceCandidate);
  };
}
