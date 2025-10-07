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


router.get("/", getProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  fetchuser,
  authorize("admin"),
  (req, res, next) => {

    const multerFields = [{ name: "images", maxCount: 10 }];
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 10; j++) {
        multerFields.push({ name: `colorImages_${i}_${j}`, maxCount: 1 });
      }
    }

    const dynamicUpload = multer({ storage }).fields(multerFields);
    dynamicUpload(req, res, next);
  },
  createProduct
);

router.put(
  "/:id",
  fetchuser,
  authorize("admin"),
  (req, res, next) => {
    const multerFields = [{ name: "images", maxCount: 10 }];
    for (let i = 0; i < 20; i++) {
      multerFields.push({ name: `colorImages_${i}`, maxCount: 10 });
    }
    const dynamicUpload = multer({ storage }).fields(multerFields);
    dynamicUpload(req, res, next);
  },
  updateProduct
);
router.delete("/:id", fetchuser, authorize("admin"), deleteProduct);

module.exports = router;
