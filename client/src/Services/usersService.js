import api from "./axiosInstance";

export const getAllUsers = async () => {
  const res = await api.post("/getAllUsers");
  return res.data.users;
};

export const searchUser = async (username, phone) => {
  const res = await api.post("/searchUser", { username, phone });
  return res.data.users;
};
