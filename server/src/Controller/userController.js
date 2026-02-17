import User from "../Model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

const registerUser = async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;

    // Check if required fields are provided
    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: "Phone and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userExists = await User.findOne({
      where: {
        phone,
      },
    });
    if (userExists) {
      return res.status(400).json({ message: "Phone number already exists" });
    }
    let newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
    });
    return res
      .status(201)
      .json({ message: "user registered successfully", userId: newUser.id });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Registration failed", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Check if required fields are provided
    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: "Phone and password are required" });
    }

    const user = await User.findOne({
      where: {
        phone,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exists" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid phone or password" });
    }
    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    // 1. Extract Query Params
    // useInfiniteQuery sends these as ?search=...&page=...
    const { search = "", page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // 2. Build Search Logic
    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { username: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    // 3. Execute Query
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit: limitNum,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    // 4. Calculate Metadata
    const totalPages = Math.ceil(count / limitNum);

    // 5. Send Response
    return res.status(200).json({
      users, // The array of users for the current page
      currentPage: pageNum,
      totalPages: totalPages,
      totalUsers: count,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export { registerUser, loginUser, getUsers };
