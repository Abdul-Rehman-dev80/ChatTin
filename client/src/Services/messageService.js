import api from "./axiosInstance";

export const getMessages = async (conversationId) => {
  const res = await api.get(`/messages/${conversationId}`);
  return res.data;
};

/** Send a text message to a conversation. */
export const sendMessage = async (conversationId, body) => {
  const res = await api.post("/messages", { conversationId, body });
  return res.data;
};
