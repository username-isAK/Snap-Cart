const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  specifications: {
    brand: { type: String },
    model: { type: String },
    material: { type: String },
    warranty: { type: String },
    details: { type: Object },
  },

  images:[String],
  availableSizes: [
    {
      size: { type: String },
      price: { type: Number },
      stock: { type: Number, default: 0 },
    },
  ],
  availableColors: [
    {
      color: { type: String },
      images: [String],
      stock: { type: Number, default: 0 },
    },
  ],
  variants: [
    {
      color: { type: String },
      storage: { type: String },
      price: { type: Number },
      stock: { type: Number, default: 0 },
    },
  ],
  stock: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
