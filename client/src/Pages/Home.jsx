import AllChat from "../Components/MessageList";
import OpenedChat from "../Components/OpenedChat";
import SideNav from "../Components/SideNav";

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-900">
      <SideNav />
      <AllChat />
      <OpenedChat />
    </div>
  );
}
