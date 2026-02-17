import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

export default function SideNav() {
  return (
    <div className="bg-gray-800 py-4 h-screen w-[70px] min-w-[70px] flex flex-col justify-between items-center border-r border-gray-700">
      <ul className="flex flex-col gap-1">
        <li>
          <button className="hover:bg-gray-700 rounded-lg p-3 transition-colors text-gray-300 hover:text-white">
            <ChatOutlinedIcon fontSize="large" />
          </button>
        </li>
        <li>
          <button className="hover:bg-gray-700 rounded-lg p-3 transition-colors text-gray-300 hover:text-white">
            <LocalPhoneIcon fontSize="large" />
          </button>
        </li>
      </ul>
      <ul className="flex flex-col gap-1">
        <li>
          <button className="hover:bg-gray-700 rounded-lg p-3 transition-colors text-gray-300 hover:text-white">
            <AccountCircleOutlinedIcon fontSize="large" />
          </button>
        </li>
        <li>
          <button className="hover:bg-gray-700 rounded-lg p-3 transition-colors text-gray-300 hover:text-white">
            <SettingsOutlinedIcon fontSize="large" />
          </button>
        </li>
      </ul>
    </div>
  );
}
