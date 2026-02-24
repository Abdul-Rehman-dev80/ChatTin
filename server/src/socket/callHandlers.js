/**
 * Call signaling handlers for WebRTC.
 * Forwards call and WebRTC events between the two peers using Socket.io.
 * Each user joins a room "user:{userId}" on connection so we can send events to them by id.
 */

const USER_ROOM = (userId) => `user:${userId}`;

/**
 * Registers all call-related socket events for one connected client.
 * @param {import("socket.io").Server} io - The Socket.io server
 * @param {import("socket.io").Socket} socket - The connected socket (must have socket.user.userId)
 */
export function registerCallHandlers(io, socket) {
  const userId = socket.user?.userId;
  if (!userId) return;

  // ----- Call lifecycle: initiate, accept, reject, end -----

  /**
   * Caller starts a call. Server forwards to the target user as "call:incoming".
   * Payload: { conversationId, targetUserId, isVideo, callerName }
   */
  socket.on("call:initiate", (payload) => {
    const { conversationId, targetUserId, isVideo, callerName } = payload || {};
    if (!targetUserId) return;
    io.to(USER_ROOM(targetUserId)).emit("call:incoming", {
      conversationId,
      callerUserId: userId,
      callerName: callerName ?? "Someone",
      isVideo: Boolean(isVideo),
    });
  });

  /**
   * Callee accepts. Server tells the caller so they can start WebRTC offer.
   * Payload: { conversationId, callerUserId }
   */
  socket.on("call:accept", (payload) => {
    const { conversationId, callerUserId } = payload || {};
    if (!callerUserId) return;
    io.to(USER_ROOM(callerUserId)).emit("call:accepted", {
      conversationId,
      calleeUserId: userId,
    });
  });

  /**
   * Callee rejects. Server tells the caller.
   * Payload: { conversationId, callerUserId }
   */
  socket.on("call:reject", (payload) => {
    const { conversationId, callerUserId } = payload || {};
    if (!callerUserId) return;
    io.to(USER_ROOM(callerUserId)).emit("call:rejected", {
      conversationId,
    });
  });

  /**
   * Either side ends the call. Server tells the other peer.
   * Payload: { targetUserId, conversationId }
   */
  socket.on("call:end", (payload) => {
    const { targetUserId, conversationId } = payload || {};
    if (!targetUserId) return;
    io.to(USER_ROOM(targetUserId)).emit("call:ended", {
      conversationId,
    });
  });

  // ----- WebRTC: offer, answer, ICE candidates -----

  /**
   * Forward SDP offer to the other peer.
   * Payload: { targetUserId, offer }
   */
  socket.on("webrtc:offer", (payload) => {
    const { targetUserId, offer } = payload || {};
    if (!targetUserId || !offer) return;
    io.to(USER_ROOM(targetUserId)).emit("webrtc:offer", { offer });
  });

  /**
   * Forward SDP answer to the other peer.
   * Payload: { targetUserId, answer }
   */
  socket.on("webrtc:answer", (payload) => {
    const { targetUserId, answer } = payload || {};
    if (!targetUserId || !answer) return;
    io.to(USER_ROOM(targetUserId)).emit("webrtc:answer", { answer });
  });

  /**
   * Forward ICE candidate to the other peer.
   * Payload: { targetUserId, candidate }
   */
  socket.on("webrtc:ice-candidate", (payload) => {
    const { targetUserId, candidate } = payload || {};
    if (!targetUserId) return;
    io.to(USER_ROOM(targetUserId)).emit("webrtc:ice-candidate", { candidate });
  });
}
