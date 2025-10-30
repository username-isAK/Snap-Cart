const mongoose =require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        selectedSize: {
          _id: { type: mongoose.Schema.Types.ObjectId },
          size: { type: String },
          price: { type: Number },
          stock: { type: Number },
        },
        selectedColor: {
          _id: { type: mongoose.Schema.Types.ObjectId },
          color: { type: String },
          images: [String],
          stock: { type: Number },
        },
        variantId: { type: mongoose.Schema.Types.ObjectId },
        variantKey: { type: String },
      },
    ],
  },
  { timestamps: true }
);


module.exports= mongoose.model("Cart", cartSchema);
