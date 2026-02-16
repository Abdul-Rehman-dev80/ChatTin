import User from "../Model/User.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;
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
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { registerUser, loginUser };
