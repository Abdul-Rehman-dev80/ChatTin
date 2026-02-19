import { useLocation } from "react-router";
import SideNav from "./SideNav";
import OpenedChat from "./OpenedChat";
import EmptyChatPlaceholder from "./EmptyChatPlaceholder";
import MessageList from "./MessageList";
import Profile from "../Pages/Profile";
import Setting from "../Pages/Setting";
import Calls from "../Pages/Calls";

export default function MainLayout() {
  const location = useLocation();
  const path = location.pathname;

  const renderMiddle = () => {
    if (path === "/") return <MessageList />;
    if (path === "/profile") return <Profile />;
    if (path === "/setting") return <Setting />;
    if (path === "/calls") return <Calls />;
    return <EmptyChatPlaceholder />;
  };

  const renderRight = () => {
    if (path === "/") return <OpenedChat />;
    return <EmptyChatPlaceholder />;
  };

  return (
    <div className="flex h-full w-full bg-gray-900">
      <SideNav />
      <div className="flex flex-1 min-w-0">        <div className="w-[400px] min-w-[270px] shrink-0 border-r border-gray-600 flex flex-col overflow-y-auto">
          {renderMiddle()}
        </div>
        <div className="flex-1 min-w-0 flex flex-col overflow-y-auto bg-gray-900">
          {renderRight()}
        </div>
      </div>
    </div>
  );
}
