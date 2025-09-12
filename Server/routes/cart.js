const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem
} = require("../controllers/cartcontroller");

const router = express.Router();

router.get("/", fetchuser, getCart);
router.post("/", fetchuser, addToCart);
router.put("/", fetchuser, updateCartItem);
router.delete("/", fetchuser, removeCartItem);

module.exports = router;
