import { useState, useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  // Initialize from localStorage if token exists
  const [currentUser, setCurrentUser] = useState(() => {
    const token = localStorage.getItem("chat_token");
    if (token) {
      // If token exists, restore user state from localStorage
      const storedUser = localStorage.getItem("chat_user");
      return storedUser ? JSON.parse(storedUser) : { authenticated: true };
    }
    return null;
  });

  // Update localStorage when currentUser changes
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