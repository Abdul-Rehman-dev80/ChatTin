import Conversation from "../Model/Conversation.js";
import ConversationMember from "../Model/ConversationMember.js";
import User from "../Model/User.js";
import { sequelize } from "../Config/dbConfig.js";

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
    const currentIds = new Set(
      currentUserConvs.map((c) => c.conversationId.toString()),
    );
    const sharedId = otherUserConvs.find((c) =>
      currentIds.has(c.conversationId.toString()),
    );

    if (sharedId) {
      const existing = await Conversation.findByPk(sharedId.conversationId, {
        include: [
          {
            model: User,
            as: "users",
            through: { attributes: [] },
            attributes: ["id", "username", "phone", "pfp", "isOnline", "lastSeen"],
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
          attributes: ["id", "username", "phone", "pfp", "isOnline", "lastSeen"],
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
    const userId = Number(req.userId);

    // One query: conversation ids + hasUnread (EXISTS, no message rows loaded)
    // With QueryTypes.SELECT, sequelize returns the rows array directly (not [rows, metadata])
    const rows = await sequelize.query(
      `SELECT cm.conversation_id AS "conversationId",
         EXISTS (
           SELECT 1 FROM message m
           WHERE m.conversation_id = cm.conversation_id
             AND m.sender_id != :userId
             AND m.created_at > COALESCE(cm.last_read_at, '1970-01-01'::timestamptz)
         ) AS "hasUnread"
       FROM conversation_member cm
       WHERE cm.user_id = :userId`,
      { replacements: { userId }, type: sequelize.QueryTypes.SELECT }
    );

    const list = Array.isArray(rows) ? rows : [];
    const conversationIds = list.map((r) => r.conversationId);
    const hasUnreadByConv = {};
    list.forEach((r) => {
      hasUnreadByConv[r.conversationId] = r.hasUnread === true;
    });

    if (conversationIds.length === 0) {
      return res.status(200).json([]);
    }

    const conversations = await Conversation.findAll({
      where: { id: conversationIds },
      include: [
        {
          model: User,
          as: "users",
          through: { attributes: [] },
          attributes: ["id", "username", "phone", "pfp", "isOnline", "lastSeen"],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    const result = conversations.map((c) => {
      const plain = c.get({ plain: true });
      plain.hasUnread = !!hasUnreadByConv[c.id];
      return plain;
    });

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
