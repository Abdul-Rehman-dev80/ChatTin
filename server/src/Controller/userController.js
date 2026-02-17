import User from "../Model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

const registerUser = async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;
    
    // Check if required fields are provided
    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required" });
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
      return res.status(400).json({ message: "Phone and password are required" });
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

const searchUser = async (req, res) => {
  try {
    const { query } = req.query;
    
    // Check if query is provided
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    const users = await User.findAll({
      where: {
        username: {
          [Op.iLike]: `%${query}%`,
        },
      },
    });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { registerUser, loginUser, searchUser };
