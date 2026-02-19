import { BrowserRouter, Routes, Route } from "react-router";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import { ToastContainer } from "react-toastify";
import PageNotFound from "./Components/PageNotFound";
import AuthProvider from "./Contexts/AuthContext";
import ProtectedRoutes from "./helpers/ProtectedRoutes";
import MainLayout from "./Components/MainLayout";

function App() {
  return (
    <div className="h-screen overflow-hidden">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoutes><MainLayout /></ProtectedRoutes>}>
              <Route index element={null} />
              <Route path="profile" element={null} />
              <Route path="setting" element={null} />
              <Route path="calls" element={null} />
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
