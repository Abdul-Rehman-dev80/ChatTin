import MessageList from "../Components/MessageList";
import OpenedChat from "../Components/OpenedChat";

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-900">
      <MessageList />
      <OpenedChat />
    </div>
  );
}
