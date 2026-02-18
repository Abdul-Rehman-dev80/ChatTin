import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Setting from "./Pages/Setting";
import { ToastContainer } from "react-toastify";
import PageNotFound from "./Components/PageNotFound";
import AuthProvider from "./Contexts/AuthContext";
import ProtectedRoutes from "./helpers/ProtectedRoutes";
import Calls from "./Pages/Calls";
import SideNav from "./Components/SideNav";

function App() {
  return (
    <div className="h-screen overflow-hidden"> {/* Prevents double scrollbars */}
      <AuthProvider>
        <BrowserRouter>
          <div className="flex h-full w-full"> {/* THE MAGIC WRAPPER */}
            
            <SideNav />

            <main className="flex-1 h-full overflow-y-auto"> {/* The scrollable content area */}
              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
                <Route path="/profile" element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
                <Route path="/setting" element={<ProtectedRoutes><Setting /></ProtectedRoutes>} />
                <Route path="/calls" element={<ProtectedRoutes><Calls /></ProtectedRoutes>} />
                
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </main>

          </div>
        </BrowserRouter>
        <ToastContainer />
      </AuthProvider>
    </div>
  );
}

export default App;
