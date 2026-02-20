import api from "./axiosInstance";

export const getMessages = async (conversationId) => {
  const res = await api.get(`/messages/${conversationId}`);
  return res.data;
};
