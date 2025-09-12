const express = require("express");
const fetchuser= require("../middleware/fetchuser");
const authorize = require("../middleware/authorize");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/ordercontroller");

const router = express.Router();

router.post("/", fetchuser, createOrder);
router.get("/myorders", fetchuser, getMyOrders);

router.get("/", fetchuser, authorize("admin"), getAllOrders);
router.put("/:id/status", fetchuser, authorize("admin"), updateOrderStatus);

module.exports = router;
