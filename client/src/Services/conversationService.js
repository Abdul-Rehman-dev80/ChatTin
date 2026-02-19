import api from "./axiosInstance";

/**
 * Create a new conversation (1-on-1 chat) with another user
 * @param {number} otherUserId - The ID of the user to start a chat with
 * @returns {Promise} The conversation object with users array
 */
export const createConversation = async (otherUserId) => {
  const res = await api.post("/conversations", {
    otherUserId: otherUserId,
  });
  return res.data; // Returns the conversation object
};

/**
 * Get all conversations for the current logged-in user
 * Returns conversations sorted by most recent activity
 * @returns {Promise} Array of conversation objects
 */
export const getConversations = async () => {
  try {
    const res = await api.get("/conversations");
    // Ensure we always return an array
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};
