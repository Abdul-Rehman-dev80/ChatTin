import { useCall } from "../Contexts/CallContext";
import IncomingCallModal from "./IncomingCallModal";
import OutgoingCallBar from "./OutgoingCallBar";
import ActiveCall from "./ActiveCall";

/**
 * Renders call overlays based on call status: incoming modal, outgoing bar, or active call screen.
 * Must be used inside CallProvider.
 */
export default function CallUI() {
  const { callStatus, CALL_STATUS } = useCall();

  if (callStatus === CALL_STATUS.RINGING_IN) {
    return <IncomingCallModal />;
  }
  if (callStatus === CALL_STATUS.RINGING_OUT) {
    return <OutgoingCallBar />;
  }
  if (callStatus === CALL_STATUS.IN_CALL) {
    return <ActiveCall />;
  }

  return null;
}
