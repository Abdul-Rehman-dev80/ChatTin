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
    <div className="flex-1 flex flex-col items-center p-8 bg-gray-900">
      <div className="w-full max-w-sm">
        <h2 className="text-xl font-semibold text-white mb-6">Settings</h2>
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-medium transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
