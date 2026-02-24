import { BrowserRouter, Routes, Route } from "react-router";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import { ToastContainer } from "react-toastify";
import PageNotFound from "./Components/PageNotFound";
import AuthProvider from "./Contexts/AuthContext";
import { ChatProvider } from "./Contexts/ChatContext";
import { CallProvider } from "./Contexts/CallContext";
import ProtectedRoutes from "./helpers/ProtectedRoutes";
import MainLayout from "./Components/MainLayout";

function App() {
  return (
    <div className="h-screen overflow-hidden bg-slate-900">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoutes>
                  <ChatProvider>
                    <CallProvider>
                      <MainLayout />
                    </CallProvider>
                  </ChatProvider>
                </ProtectedRoutes>
              }
            >
              <Route index element={null} />
              <Route path="profile" element={null} />
              <Route path="setting" element={null} />
              <Route path="calls" element={null} />
              <Route path="otherUserProfile" element={null} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </AuthProvider>
    </div>
  );
}

export default App;
