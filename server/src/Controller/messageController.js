import Message from "../Model/Message.js";
import User from "../Model/User.js";
import ConversationMember from "../Model/ConversationMember.js";

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;

    const membership = await ConversationMember.findOne({
      where: { conversationId, userId },
    });
    if (!membership) {
      return res.status(403).json({ message: "Not a member of this conversation" });
    }

    const messages = await Message.findAll({
      where: { conversationId },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "username", "pfp"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json(messages);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Send a new message. User must be in the conversation.
const sendMessage = async (req, res) => {
  try {
    const { conversationId, body } = req.body;
    const senderId = req.userId;

    if (!conversationId || !body?.trim()) {
      return res.status(400).json({ message: "conversationId and body are required" });
    }

    const membership = await ConversationMember.findOne({
      where: { conversationId, userId: senderId },
    });
    if (!membership) {
      return res.status(403).json({ message: "Not a member of this conversation" });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      body: body.trim(),
    });

    const io = req.app.get("io");
    if (io) {
      io.to(`conversation:${conversationId}`).emit("new_message", message);
    }

    return res.status(201).json(message);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export { getMessages, sendMessage };
