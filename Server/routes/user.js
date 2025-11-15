const express = require("express");
const { body } = require("express-validator");
const { createUser, loginUser, getUser, deleteUser, sendOtp, sendResetOtp, resetPassword,
  addAddress,getAddresses,deleteAddress,updateAddress,setDefaultAddress,} = require("../controllers/usercontroller");
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

router.post("/addresses", fetchuser, addAddress);
router.get("/addresses", fetchuser, getAddresses);
router.delete("/address/:id", fetchuser, deleteAddress);
router.put("/addresses/:id", fetchuser, updateAddress);
router.patch("/addresses/:id/default", fetchuser, setDefaultAddress);

module.exports = router;
