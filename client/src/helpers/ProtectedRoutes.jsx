import { useAuth } from "../Contexts/AuthContext";

function ProtectedRoutes({ children }) {
  const { currentUser } = useAuth();
  
  // If user is not authenticated, redirect to login
  if (!currentUser || !currentUser.authenticated) {
    window.location.href = "/login";
    return null; // Don't render anything while redirecting
  }
  
  // If authenticated, render the protected content
  return children;
}
export default ProtectedRoutes;
