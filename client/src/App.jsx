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

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoutes>
                  <Home />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoutes>
                  <Profile />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/setting"
              element={
                <ProtectedRoutes>
                  <Setting />
                </ProtectedRoutes>
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </AuthProvider>
    </>
  );
}

export default App;
