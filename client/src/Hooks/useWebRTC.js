import { useEffect, useState } from "react";
import { socket } from "../Services/socketService";

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

export function useWebRTC({ remoteUserId, isInitiator, isVideo, setRemoteStream }) {
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    let pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    let localStream = null;
    /** If the callee gets the offer before we've added tracks, process it after adding tracks */
    let pendingOffer = null;
    /** ICE candidates that arrived before we set remote description; add them after we set it */
    const iceCandidateQueue = [];

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
      if (!offer) return;
      try {
        if (pc.getSenders().length > 0) {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          await drainIceQueue();
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("webrtc:answer", { targetUserId: remoteUserId, answer });
        } else {
          pendingOffer = offer;
        }
      } catch (err) {
        console.error("Handle offer failed", err);
      }
    };
    const handleAnswer = async ({ answer }) => {
      if (!answer) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        await drainIceQueue();
      } catch (err) {
        console.error("Handle answer failed", err);
      }
    };
    const handleIceCandidate = async ({ candidate }) => {
      if (!candidate) return;
      if (!pc.remoteDescription) {
        iceCandidateQueue.push(candidate);
        return;
      }
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Handle ICE failed", err);
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
          video: isVideo
        });

        // 2. Add our tracks to the connection
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

        // 3. If we're callee and offer arrived before we had tracks, process it now
        if (pendingOffer) {
          await pc.setRemoteDescription(new RTCSessionDescription(pendingOffer));
          await drainIceQueue();
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("webrtc:answer", { targetUserId: remoteUserId, answer });
          pendingOffer = null;
        }

        // 4. Receive the other person's video
        pc.ontrack = (event) => setRemoteStream(event.streams[0]);

        // 5. Send our network "address" (ICE) to the other peer
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("webrtc:ice-candidate", { targetUserId: remoteUserId, candidate: event.candidate });
          }
        };

        // 6. Create Offer (if we started the call)
        if (isInitiator) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("webrtc:offer", { targetUserId: remoteUserId, offer });
        }
      } catch (err) {
        console.error("Call failed", err);
      } finally {
        setIsConnecting(false);
      }
    }

    startCall();

    // CLEANUP: Close everything when the component disappears
    return () => {
      localStream?.getTracks().forEach(t => t.stop());
      pc.close();
      socket.off("webrtc:offer", handleOffer);
      socket.off("webrtc:answer", handleAnswer);
      socket.off("webrtc:ice-candidate", handleIceCandidate);
    };
  }, [remoteUserId, isInitiator, isVideo, setRemoteStream]);

  return { isConnecting };
}