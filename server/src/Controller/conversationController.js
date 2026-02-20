import Conversation from "../Model/Conversation.js";
import ConversationMember from "../Model/ConversationMember.js";
import User from "../Model/User.js";
import { Op } from "sequelize";

export const createConversation = async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const currentUserId = req.userId;

    if (!otherUserId || Number(otherUserId) === currentUserId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // 1. Efficient check for existing direct chat
    const existing = await Conversation.findOne({
      where: { type: "direct" },
      include: [{
        model: ConversationMember,
        as: "members", // Ensure this alias matches your associations
        where: { userId: [currentUserId, otherUserId] }
      }],
      group: ['conversation.id'],
      having: Sequelize.literal('count(DISTINCT "members"."user_id") = 2')
    });

    if (existing) return res.status(200).json(existing);

    // 2. Create and Link
    const conversation = await Conversation.create({ type: "direct", createdBy: currentUserId });
    
    await ConversationMember.bulkCreate([
      { conversationId: conversation.id, userId: currentUserId },
      { conversationId: conversation.id, userId: otherUserId },
    ]);

    // 3. Return the new chat with user details
    const result = await Conversation.findByPk(conversation.id, {
      include: [{ model: User, as: "users", through: { attributes: [] }, attributes: ["id", "username", "pfp"] }],
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
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
          attributes: [] 
        },
        { 
          model: User, 
          as: "users", 
          through: { attributes: [] }, 
          attributes: ["id", "username", "pfp"] 
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};