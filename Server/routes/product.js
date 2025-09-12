const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const authorize = require("../middleware/authorize");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productcontroller");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", fetchuser, authorize("admin"), createProduct);
router.put("/:id", fetchuser, authorize("admin"), updateProduct);
router.delete("/:id", fetchuser, authorize("admin"), deleteProduct);

module.exports = router;
