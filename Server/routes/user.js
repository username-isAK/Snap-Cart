const express = require("express");
const { body } = require("express-validator");
const { createUser, loginUser, getUser, deleteUser } = require("../controllers/usercontroller");
const fetchuser = require("../middleware/fetchuser");

const router = express.Router();

router.post("/register",
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  createUser
);

router.post("/login",
  body("email").isEmail(),
  body("password").exists(),
  loginUser
);

router.get("/me", fetchuser, getUser);

router.delete("/me", fetchuser, deleteUser);

module.exports = router;
