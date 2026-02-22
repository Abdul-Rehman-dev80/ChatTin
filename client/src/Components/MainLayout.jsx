import { useLocation } from "react-router";
import { useState } from "react";
import SideNav from "./SideNav";
import OpenedChat from "./OpenedChat";
import EmptyChatPlaceholder from "./EmptyChatPlaceholder";
import ChatList from "./ChatList";
import Profile from "../Pages/Profile";
import Setting from "../Pages/Setting";
import Calls from "../Pages/Calls";
import Loader from "./Loader";

export default function MainLayout() {
  const location = useLocation();
  const path = location.pathname;

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const renderMiddle = () => {
    if (path === "/")
      return (
        <ChatList
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversation?.id}
          onCreatingConversation={setIsCreatingConversation}
        />
      );
    if (path === "/profile") return <Profile />;
    if (path === "/setting") return <Setting />;
    if (path === "/calls") return <Calls />;
    return <EmptyChatPlaceholder />;
  };

  const renderRight = () => {
    if (path !== "/") return <EmptyChatPlaceholder />;
    // When user clicks someone from search, we show loading until the new chat opens
    if (isCreatingConversation) {
      return (
        <div className="bg-gray-800 w-full flex flex-col h-screen items-center justify-center">
          <Loader />
          <p className="text-gray-400 mt-3">Starting conversation...</p>
        </div>
      );
    }
    return <OpenedChat selectedConversation={selectedConversation} />;
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
