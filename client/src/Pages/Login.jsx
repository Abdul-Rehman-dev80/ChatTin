import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { loginUser } from "../services/authService";
import { socket } from "../services/socketService";

export default function Login() {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

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
      toast.success("Logged in successfully!", {
        autoClose: 2000,
        draggable: true,
      });
      socket.connect();
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
    <div className="h-screen flex justify-center items-center bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 flex flex-col p-8 rounded-xl w-[400px] shadow-2xl border border-gray-700"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white">ChatTin</h1>
        <hr className="mb-6 border-gray-700" />

        <label htmlFor="phone" className="text-sm font-medium text-gray-300 mb-2">
          Phone Number
        </label>
        <input
          className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
          value={formData.phone}
          onChange={handleChange}
          type="text"
          id="phone"
          placeholder="Enter your phone number"
        />

        <label htmlFor="password" className="text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <input
          className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
          value={formData.password}
          onChange={handleChange}
          type="password"
          id="password"
          placeholder="Enter your password"
        />
        
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:text-blue-400">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
