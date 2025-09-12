const express = require("express");
const fetchuser= require("../middleware/fetchuser");
const authorize = require("../middleware/authorize");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require("../controllers/categorycontroller");

const router = express.Router();

router.get("/", getCategories);

router.post("/", fetchuser, authorize("admin"), createCategory);
router.put("/:id", fetchuser, authorize("admin"), updateCategory);
router.delete("/:id", fetchuser, authorize("admin"), deleteCategory);

module.exports = router;
