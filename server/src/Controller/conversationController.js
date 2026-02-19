import Conversation from "../Model/Conversation.js";
import ConversationMember from "../Model/ConversationMember.js";
import User from "../Model/User.js";

export const createConversation = async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const currentUserId = req.userId;

    if (!otherUserId) {
      return res.status(400).json({ message: "otherUserId is required" });
    }

    if (Number(otherUserId) === currentUserId) {
      return res.status(400).json({ message: "Cannot create chat with yourself" });
    }

    const otherUser = await User.findByPk(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if direct conversation already exists
    const existingMembers = await ConversationMember.findAll({
      where: { userId: currentUserId },
      include: [{ model: Conversation, where: { type: "direct" } }],
    });

    for (const m of existingMembers) {
      const members = await ConversationMember.findAll({
        where: { conversationId: m.conversationId },
      });
      if (members.some((mb) => mb.userId === Number(otherUserId))) {
        const conv = await Conversation.findByPk(m.conversationId, {
          include: [{ model: User, as: "users", through: { attributes: [] }, attributes: ["id", "username", "pfp", "phone"] }],
        });
        return res.status(200).json(conv);
      }
    }

    const conversation = await Conversation.create({
      type: "direct",
      createdBy: currentUserId,
    });

    await ConversationMember.bulkCreate([
      { conversationId: conversation.id, userId: currentUserId },
      { conversationId: conversation.id, userId: otherUserId },
    ]);

    const result = await Conversation.findByPk(conversation.id, {
      include: [{ model: User, as: "users", through: { attributes: [] }, attributes: ["id", "username", "pfp", "phone"] }],
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const listConversations = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all conversations where the user is a member
    const memberRows = await ConversationMember.findAll({
      where: { userId },
      include: [
        {
          model: Conversation,
          as: "conversation",
          include: [
            {
              model: User,
              as: "users",
              through: { attributes: [] },
              attributes: ["id", "username", "pfp", "phone"],
            },
          ],
        },
      ],
    });

    // Extract conversations and sort by most recent
    const conversations = memberRows
      .map((m) => m.conversation)
      .filter(Boolean)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return res.status(200).json(conversations);
  } catch (error) {
    console.error("Error listing conversations:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};