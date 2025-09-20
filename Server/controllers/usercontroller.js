const User = require("../schemas/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
      role: "user",
    });

    const data = { user: { id: user.id, role: user.role } };
    const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      success: true,
      token: authtoken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) return res.status(400).json({ error: "Incorrect password" });

    const data = { user: { id: user.id, role: user.role } };
    const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      success: true,
      token: authtoken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    console.log("Fetching user with ID:", req.user.id);

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("getUser error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
