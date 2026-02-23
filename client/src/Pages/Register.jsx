import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router";
import { registerUser } from "../Services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("Account created successfully!", data);
      toast.success("Account created successfully!", {
        autoClose: 2000,
        draggable: true,
      });
      navigate("/login");
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg, {
        autoClose: 2000,
        draggable: true,
      });
    },
  });

  const handleRegister = (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      return toast.info("Fill in all the fields!", {
        autoClose: 2000,
        draggable: true,
      });
    }

    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-slate-900 px-4 py-8">
      <form
        onSubmit={handleRegister}
        className="bg-slate-800 flex flex-col p-8 rounded-xl w-full max-w-[400px] shadow-2xl border border-slate-600"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white">ChatTin</h1>
        <hr className="mb-6 border-slate-600" />
        
        <label htmlFor="username" className="text-sm font-medium text-slate-300 mb-2">
          Username
        </label>
        <input
          className="bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-400"
          value={formData.username}
          onChange={handleChange}
          type="text"
          id="username"
          placeholder="Choose a username"
        />

        <label htmlFor="email" className="text-sm font-medium text-slate-300 mb-2">
          Email
        </label>
        <input
          className="bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-400"
          value={formData.email}
          onChange={handleChange}
          type="email"
          id="email"
          placeholder="Enter your email"
        />

        <label htmlFor="phone" className="text-sm font-medium text-slate-300 mb-2">
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

        <label htmlFor="password" className="text-sm font-medium text-slate-300 mb-2">
          Password
        </label>
        <div className="relative mb-6">
          <input
            className="bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-400"
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Create a password"
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
          {mutation.isPending ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-slate-400 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
