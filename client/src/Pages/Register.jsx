import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 px-4 py-8">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 flex flex-col p-8 rounded-xl w-full max-w-[400px] shadow-2xl border border-gray-700"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white">ChatTin</h1>
        <hr className="mb-6 border-gray-700" />
        
        <label htmlFor="username" className="text-sm font-medium text-gray-300 mb-2">
          Username
        </label>
        <input
          className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
          value={formData.username}
          onChange={handleChange}
          type="text"
          id="username"
          placeholder="Choose a username"
        />

        <label htmlFor="email" className="text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <input
          className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
          value={formData.email}
          onChange={handleChange}
          type="email"
          id="email"
          placeholder="Enter your email"
        />

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
          placeholder="Create a password"
        />
        
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {mutation.isPending ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:text-blue-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
