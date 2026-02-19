import { useLocation } from "react-router";
import { useState } from "react";
import SideNav from "./SideNav";
import OpenedChat from "./OpenedChat";
import EmptyChatPlaceholder from "./EmptyChatPlaceholder";
import ChatList from "./ChatList";
import Profile from "../Pages/Profile";
import Setting from "../Pages/Setting";
import Calls from "../Pages/Calls";

export default function MainLayout() {
  const location = useLocation();
  const path = location.pathname;
  
  // State to store the currently selected conversation
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Function to handle when a conversation is clicked
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const renderMiddle = () => {
    if (path === "/")
      return (
        <ChatList
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversation?.id}
        />
      );
    if (path === "/profile") return <Profile />;
    if (path === "/setting") return <Setting />;
    if (path === "/calls") return <Calls />;
    return <EmptyChatPlaceholder />;
  };

  const renderRight = () => {
    if (path === "/")
      return <OpenedChat selectedConversation={selectedConversation} />;
    return <EmptyChatPlaceholder />;
  };

  return (
    <div className="flex h-full w-full bg-gray-900">
      <SideNav />
      <div className="flex flex-1 min-w-0">
        <div className="w-87.5 min-w-67.5 shrink-0 border-r border-gray-600 flex flex-col overflow-y-auto">
          {renderMiddle()}
        </div>
        <div className="flex-1 min-w-75 flex flex-col overflow-y-auto bg-gray-900">
          {renderRight()}
        </div>
      </div>
    </div>
  );
}
