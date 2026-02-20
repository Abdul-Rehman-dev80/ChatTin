import Message from "../Model/Message.js";
import User from "../Model/User.js";

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;

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

export { getMessages };
