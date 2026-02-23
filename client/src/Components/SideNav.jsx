import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { Link, useLocation } from "react-router-dom";
import { useChat } from "../Contexts/ChatContext";

const navLinks = [
  { to: "/", icon: ChatOutlinedIcon, label: "Chats" },
  { to: "/calls", icon: LocalPhoneIcon, label: "Calls" },
  { to: "/profile", icon: AccountCircleOutlinedIcon, label: "Profile" },
  { to: "/setting", icon: SettingsOutlinedIcon, label: "Settings" },
];

export default function SideNav() {
  const location = useLocation();
  const { selectedConversationId } = useChat();
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }
  const hideBottomNav = location.pathname === "/" && !!selectedConversationId;

  const NavItem = ({ to, icon: Icon, label, isActive }) => (
    <li className="list-none">
      <Link
        to={to}
        className={`flex rounded-lg p-3 transition-colors justify-center ${
          isActive
            ? "bg-cyan-600/30 text-cyan-400"
            : "text-slate-300 hover:bg-slate-700 hover:text-white"
        }`}
        aria-label={label}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon fontSize="large" />
      </Link>
    </li>
  );

  return (
    <>
      {/* Desktop: vertical left nav */}
      <nav
        className="hidden md:flex flex-col justify-between items-center py-4 h-screen w-[70px] min-w-[70px] bg-slate-800 border-r border-slate-600"
        aria-label="Main navigation"
      >
        <ul className="flex flex-col gap-1 list-none">
          {navLinks.slice(0, 2).map((item) => (
            <NavItem key={item.to} {...item} isActive={location.pathname === item.to} />
          ))}
        </ul>
        <ul className="flex flex-col gap-1 list-none">
          {navLinks.slice(2).map((item) => (
            <NavItem key={item.to} {...item} isActive={location.pathname === item.to} />
          ))}
        </ul>
      </nav>

      {/* Mobile: bottom bar (hidden when chat is open) */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-20 flex flex-row justify-around items-center h-16 bg-slate-800 border-t border-slate-600 list-none ${hideBottomNav ? "hidden" : "flex"}`}
        aria-label="Main navigation"
      >
        <ul className="flex flex-row justify-around items-center flex-1 list-none m-0 p-0">
        {navLinks.map((item) => (
          <NavItem key={item.to} {...item} isActive={location.pathname === item.to} />
        ))}
        </ul>
      </nav>
    </>
  );
}
