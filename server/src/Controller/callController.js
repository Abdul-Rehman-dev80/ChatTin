import Call from "../Model/Call.js";
import User from "../Model/User.js";
import { Op } from "sequelize";

const getCalls = async (req, res) => {
  try {
    const userId = req.userId;
    const calls = await Call.findAll({
      where: {
        [Op.or]: [{ callerUserId: userId }, { calleeUserId: userId }],
      },
      include: [
        { model: User, as: "caller", attributes: ["id", "username", "pfp"] },
        { model: User, as: "callee", attributes: ["id", "username", "pfp"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (calls.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(calls);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export default getCalls;
