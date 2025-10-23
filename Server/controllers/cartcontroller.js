const Cart = require("../schemas/Cart");
const mongoose = require("mongoose");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ error: "Quantity must be at least 1" });

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const cart = await Cart.findOne({ user: userId });

    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    const existingItem = cart.items.find(i => i.product.toString() === productId);
    if (existingItem) existingItem.quantity += quantity;
    else cart.items.push({ product: productId, quantity });

    await cart.save();
    const populatedCart = await cart.populate("items.product", "name price images");
    res.json(populatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const cart = await Cart.findOne({ user: userId })
      .populate("items.product", "name price images"); 

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json({ items: cart.items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await cart.populate("items.product", "name price images");
    res.json(populatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const cart = await Cart.findOne({ user: userId });
    const { productId } = req.body;
    if (!productId || productId.length !== 24) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).json({ error: "Server error while removing cart item" });
  }
};

