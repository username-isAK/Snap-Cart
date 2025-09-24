const User = require("../schemas/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Otp = require("../schemas/OTP");
const { validationResult } = require("express-validator");
const sendEmail = require("./sendEmail");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.createUser = async (req, res) => {
  const { name, email, password, code } = req.body;

  try {
    const otpDoc = await Otp.findOne({ email, code });
    if (!otpDoc) return res.status(400).json({ message: "Invalid or expired OTP" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);

    const newUser = await User.create({ name, email, password: secPass, isVerified: true, role: "user" });

    await Otp.deleteMany({ email });

    const data = { user: { id: newUser.id, role: newUser.role } };
    const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Email verified & account created successfully",
      token: authtoken,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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

exports.sendResetOtp = async (req, res) => {
  const { email } = req.body;
  try{
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.create({ email, code });
  try {
      await sendEmail(email, "Reset your password", 
        `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;"></div>
        <h2>Hello, ${user.name} 👋</h2>
        <p>To reset your Password, please use the OTP below:</p>
        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; font-size: 18px; text-align: center; font-weight: bold; color: #333; letter-spacing: 2px;">
          ${code}
        </div>
        <p style="margin-top: 15px;">⏳ This OTP is valid for <strong>5 minutes</strong>. Please don’t share it with anyone.</p>
        <p>Thank you for choosing <strong>Snap Cart</strong>!</p>
        <hr style="margin-top: 20px;" />
        <small style="color: #777;">If you didn’t request this, you can safely ignore this email.</small>
        </div>`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to send OTP email" });
    }

  res.json({ message: "OTP sent" });
  } catch(err){
    console.error("sendOtp error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const validOtp = await Otp.findOne({ email, code: otp });
  if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  await Otp.deleteMany({ email });

  res.json({ message: "Password reset successful" });
};

exports.sendOtp = async (req, res) => {
  const { email,name } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({ email, code: otpCode });

    try {
      await sendEmail(email, "Verify your account", 
        `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;"></div>
        <h2>Welcome to Snap Cart, ${name} 👋</h2>
        <p>Thanks for signing up! To complete your registration, please verify your email using the One Time Password below:</p>
        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; font-size: 18px; text-align: center; font-weight: bold; color: #333; letter-spacing: 2px;">
          ${otpCode}
        </div>
        <p style="margin-top: 15px;">⏳ This OTP is valid for <strong>5 minutes</strong>. Please don’t share it with anyone.</p>
        <p>Thank you for choosing <strong>Snap Cart</strong>!</p>
        <hr style="margin-top: 20px;" />
        <small style="color: #777;">If you didn’t request this, you can safely ignore this email.</small>
        </div>`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to send OTP email" });
    }

    res.status(200).json({ message: "OTP sent to email. Please verify." });
  } catch (err) {
    console.error("sendOtp error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


