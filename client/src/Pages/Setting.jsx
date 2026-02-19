import { useAuth } from "../Contexts/AuthContext.jsx";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function Setting() {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-full bg-[#1a1a1a] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-gray-800/80 border border-gray-700/50 p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">Settings</h2>
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-medium transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
