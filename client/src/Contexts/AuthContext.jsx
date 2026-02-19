import { useState, useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { getMe } from "../Services/authService.js";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const token = localStorage.getItem("chat_token");
    if (token) {
      const storedUser = localStorage.getItem("chat_user");
      return storedUser ? JSON.parse(storedUser) : { authenticated: true };
    }
    return null;
  });

  useEffect(() => {
    if (!currentUser?.authenticated || currentUser.id) return;
    const token = localStorage.getItem("chat_token");
    if (!token) return;
    getMe()
      .then((user) => setCurrentUser({ ...user, authenticated: true }))
      .catch(() => setCurrentUser(null));
  }, [currentUser?.authenticated, currentUser?.id]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("chat_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("chat_user");
      localStorage.removeItem("chat_token");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { useAuth, AuthProvider };