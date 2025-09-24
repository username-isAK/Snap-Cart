const express = require("express");
const { body } = require("express-validator");
const { createUser, loginUser, getUser, deleteUser, sendOtp, sendResetOtp, resetPassword } = require("../controllers/usercontroller");
const fetchuser = require("../middleware/fetchuser");

const router = express.Router();

router.post("/register",
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("code").isLength({ min: 6, max: 6 }),
  createUser
);

router.post("/send-otp",
  body("email").isEmail(),
  sendOtp
);

router.post("/login",
  body("email").isEmail(),
  body("password").exists(),
  loginUser
);

router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);

router.get("/me", fetchuser, getUser);

router.delete("/me", fetchuser, deleteUser);

module.exports = router;
