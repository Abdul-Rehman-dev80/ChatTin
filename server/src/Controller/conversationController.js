import Conversation from "../Model/Conversation.js";
import ConversationMember from "../Model/ConversationMember.js";
import User from "../Model/User.js";

export const createConversation = async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const currentUserId = req.userId;

    if (!otherUserId || Number(otherUserId) === currentUserId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // 1. Find existing direct chat that has BOTH current user and the other user
    const currentUserConvs = await ConversationMember.findAll({
      where: { userId: currentUserId },
      attributes: ["conversationId"],
    });
    const otherUserConvs = await ConversationMember.findAll({
      where: { userId: otherUserId },
      attributes: ["conversationId"],
    });
    const currentIds = new Set(currentUserConvs.map((c) => c.conversationId.toString()));
    const sharedId = otherUserConvs.find((c) => currentIds.has(c.conversationId.toString()));

    if (sharedId) {
      const existing = await Conversation.findByPk(sharedId.conversationId, {
        include: [
          {
            model: User,
            as: "users",
            through: { attributes: [] },
            attributes: ["id", "username", "phone", "pfp"],
          },
        ],
      });
      if (existing) return res.status(200).json(existing);
    }

    // 2. Create and Link
    const conversation = await Conversation.create({
      type: "direct",
      createdBy: currentUserId,
    });

    await ConversationMember.bulkCreate([
      { conversationId: conversation.id, userId: currentUserId },
      { conversationId: conversation.id, userId: otherUserId },
    ]);

    // 3. Return the new chat with user details
    const result = await Conversation.findByPk(conversation.id, {
      include: [
        {
          model: User,
          as: "users",
          through: { attributes: [] },
          attributes: ["id", "username", "phone", "pfp"],
        },
      ],
    });

    return res.status(201).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const listConversations = async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      include: [
        {
          model: ConversationMember,
          as: "members",
          where: { userId: req.userId },
          attributes: [],
        },
        {
          model: User,
          as: "users",
          through: { attributes: [] },
          attributes: ["id", "username", "phone", "pfp"],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    return res.status(200).json(conversations);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
