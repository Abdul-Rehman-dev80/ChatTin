import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate, Link } from "react-router";
import { toast } from "react-toastify";
import { loginUser } from "../Services/authService";
import { reconnectSocket } from "../Services/socketService";
import { useAuth } from "../Contexts/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { setCurrentUser } = useAuth();

  const navigate = useNavigate();

  function handleChange(e) {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Logged in successfully!", data);

      // Validate that token exists in response
      if (!data?.token) {
        toast.error("Login failed: No token received", {
          autoClose: 2000,
          draggable: true,
        });
        return;
      }

      localStorage.setItem("chat_token", data.token);
      setCurrentUser({ ...data.user, authenticated: true });
      toast.success("Logged in successfully!", {
        autoClose: 2000,
        draggable: true,
      });
      reconnectSocket();
      navigate("/");
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg, {
        autoClose: 2000,
        draggable: true,
      });
    },
  });

  function handleLogin(e) {
    e.preventDefault();

    if (!formData.phone || !formData.password) {
      return toast.info("Fill in all the fields!", {
        autoClose: 2000,
        draggable: true,
      });
    }
    mutation.mutate(formData);
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-slate-900 px-4 py-8">
      <form
        onSubmit={handleLogin}
        className="bg-slate-800 flex flex-col p-8 rounded-xl w-full max-w-100 shadow-2xl border border-slate-600"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          ChatTin
        </h1>
        <hr className="mb-6 border-slate-600" />

        <label
          htmlFor="phone"
          className="text-sm font-medium text-slate-300 mb-2"
        >
          Phone Number
        </label>
        <input
          className="bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-400"
          value={formData.phone}
          onChange={handleChange}
          type="text"
          id="phone"
          placeholder="Enter your phone number"
        />

        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-300 mb-2"
        >
          Password
        </label>
        <div className="relative mb-6">
          <input
            className="bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-400"
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </button>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-slate-400 text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-cyan-400 hover:text-cyan-300">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
