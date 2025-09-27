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

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", fetchuser, authorize("admin"), upload.array("images", 5),createProduct);
router.put("/:id", fetchuser, authorize("admin"), upload.array("images", 5), updateProduct);
router.delete("/:id", fetchuser, authorize("admin"), deleteProduct);

module.exports = router;
