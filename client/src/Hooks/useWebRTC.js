import { useEffect, useState } from "react";
import { socket } from "../Services/socketService";

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

export function useWebRTC({
  remoteUserId,
  isInitiator,
  isVideo,
  setRemoteStream,
  localStreamRef,
}) {
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    let pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    let localStream = null;
    let cancelled = false;
    /** If the callee gets the offer before we've added tracks, process it after adding tracks */
    let pendingOffer = null;
    /** ICE candidates that arrived before we set remote description; add them after we set it */
    const iceCandidateQueue = [];

    // Set track/ICE handlers once so we don't miss events; guard setRemoteStream in case it's missing
    pc.ontrack = (event) => {
      if (typeof setRemoteStream === "function" && event.streams?.[0]) {
        setRemoteStream(event.streams[0]);
      }
    };
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc:ice-candidate", {
          targetUserId: remoteUserId,
          candidate: event.candidate,
        });
      }
    };

    async function drainIceQueue() {
      while (iceCandidateQueue.length > 0) {
        const c = iceCandidateQueue.shift();
        if (c?.candidate) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(c));
          } catch (err) {
            console.error("Add ICE failed", err);
          }
        }
      }
    }

    // Register listeners first so we never miss the offer (caller sends it as soon as they're ready)
    const handleOffer = async ({ offer }) => {
      if (!offer || pc.signalingState === "closed") return;
      try {
        if (pc.getSenders().length > 0) {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          if (pc.signalingState === "closed") return;
          await drainIceQueue();
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("webrtc:answer", { targetUserId: remoteUserId, answer });
        } else {
          pendingOffer = offer;
        }
      } catch (err) {
        if (!cancelled) console.error("Handle offer failed", err);
      }
    };
    const handleAnswer = async ({ answer }) => {
      if (!answer || pc.signalingState === "closed") return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        await drainIceQueue();
      } catch (err) {
        if (!cancelled) console.error("Handle answer failed", err);
      }
    };
    const handleIceCandidate = async ({ candidate }) => {
      if (!candidate || pc.signalingState === "closed") return;
      if (!pc.remoteDescription) {
        iceCandidateQueue.push(candidate);
        return;
      }
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        if (!cancelled) console.error("Handle ICE failed", err);
      }
    };

    socket.on("webrtc:offer", handleOffer);
    socket.on("webrtc:answer", handleAnswer);
    socket.on("webrtc:ice-candidate", handleIceCandidate);

    async function startCall() {
      try {
        // 1. Get Camera/Mic
        localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: isVideo,
        });
        if (cancelled || pc.signalingState === "closed") return;
        if (localStreamRef) localStreamRef.current = localStream;

        // 2. Add our tracks to the connection (only if connection is still open)
        if (pc.signalingState !== "closed") {
          localStream
            .getTracks()
            .forEach((track) => pc.addTrack(track, localStream));
        }

        // 3. If we're callee and offer arrived before we had tracks, process it now
        if (pendingOffer && pc.signalingState !== "closed") {
          await pc.setRemoteDescription(
            new RTCSessionDescription(pendingOffer),
          );
          await drainIceQueue();
          if (pc.signalingState === "closed") return;
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("webrtc:answer", { targetUserId: remoteUserId, answer });
          pendingOffer = null;
        }

        // 4. Create Offer (if we started the call). ontrack/onicecandidate already set above.
        if (isInitiator && pc.signalingState !== "closed") {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("webrtc:offer", { targetUserId: remoteUserId, offer });
        }
      } catch (err) {
        if (!cancelled) console.error("Call failed", err);
      } finally {
        if (!cancelled) setIsConnecting(false);
      }
    }

    startCall();

    // CLEANUP: Close everything when the component disappears
    return () => {
      cancelled = true;
      localStream?.getTracks().forEach((t) => t.stop());
      pc.close();
      if (localStreamRef) localStreamRef.current = null;
      socket.off("webrtc:offer", handleOffer);
      socket.off("webrtc:answer", handleAnswer);
      socket.off("webrtc:ice-candidate", handleIceCandidate);
    };
  }, [remoteUserId, isInitiator, isVideo, setRemoteStream, localStreamRef]);

  return { isConnecting };
}
