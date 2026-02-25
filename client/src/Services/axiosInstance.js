import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
export { SERVER_URL };

// Use a relative base URL so Vite's dev proxy (and ngrok HTTPS) can forward
// requests to the backend without mixed content or CORS issues.
const api = axios.create({
  baseURL: "/api",
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("chat_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response, // If the request succeeds, just return the response
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("chat_token");
      window.location.href = "/login"; // Force redirect to login
    }
    return Promise.reject(error);
  },
);

export default api;
