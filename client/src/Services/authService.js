import api from "./axiosInstance.js";

export const loginUser = async (userData) => {
  const res = await api.post("/login", userData);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await api.post("/register", userData);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/me");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.patch("/me", data);
  return res.data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await api.post("/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
