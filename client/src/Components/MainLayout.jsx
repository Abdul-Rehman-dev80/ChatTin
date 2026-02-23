import { useLocation } from "react-router";
import SideNav from "./SideNav";
import OpenedChat from "./OpenedChat";
import EmptyChatPlaceholder from "./EmptyChatPlaceholder";
import ChatList from "./ChatList";
import Profile from "../Pages/Profile";
import Setting from "../Pages/Setting";
import Calls from "../Pages/Calls";
import Loader from "./Loader";
import { useChat } from "../Contexts/ChatContext";

export default function MainLayout() {
  const location = useLocation();
  const path = location.pathname;
  const { isCreatingConversation, selectedConversationId } = useChat();

  // Mobile: show list OR chat (not both). Desktop: show both side by side.
  const showListOnMobile = path !== "/" || !selectedConversationId;
  const showChatOnMobile = path === "/" && !!selectedConversationId;

  const renderMiddle = () => {
    if (path === "/") return <ChatList />;
    if (path === "/profile") return <Profile />;
    if (path === "/setting") return <Setting />;
    if (path === "/calls") return <Calls />;
    return <EmptyChatPlaceholder />;
  };

  const renderRight = () => {
    if (path !== "/") return <EmptyChatPlaceholder />;
    if (isCreatingConversation) {
      return (
        <div className="bg-gray-800 w-full flex flex-col h-screen items-center justify-center">
          <Loader />
          <p className="text-gray-400 mt-3">Starting conversation...</p>
        </div>
      );
    }
    return <OpenedChat />;
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-gray-900">
      <div className="order-2 md:order-1 shrink-0">
        <SideNav />
      </div>
      <main className={`order-1 md:order-2 flex-1 flex min-w-0 min-h-0 md:pb-0`}>
        <div
          className={`flex flex-col overflow-y-auto border-r border-gray-600 md:w-[350px] md:min-w-[280px] md:shrink-0 ${
            showListOnMobile ? "flex w-full" : "hidden md:flex"
          }`}
        >
          {renderMiddle()}
        </div>
        <div
          className={`flex flex-col overflow-y-auto bg-gray-900 flex-1 min-w-0 ${
            showChatOnMobile ? "flex" : "hidden md:flex"
          }`}
        >
          {renderRight()}
        </div>
      </main>
    </div>
  );
}
