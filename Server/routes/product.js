const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const authorize = require("../middleware/authorize");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productcontroller");

const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

const uploadAny = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", fetchuser, authorize("admin"), uploadAny, createProduct);
router.put("/:id", fetchuser, authorize("admin"), uploadAny, updateProduct);
router.delete("/:id", fetchuser, authorize("admin"), deleteProduct);

module.exports = router;
