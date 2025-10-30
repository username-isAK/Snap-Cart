const Cart = require("../schemas/Cart");
const mongoose = require("mongoose");
const Product = require("../schemas/Product")

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, selectedSize, selectedColor } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    let variantId = null;
    let availableStock = product.stock;

    let sizeData = null;
    if (selectedSize?._id) {
      const size = product.availableSizes.id(selectedSize._id);
      if (!size) return res.status(400).json({ error: "Size not found" });
      sizeData = {
        _id: size._id,
        size: size.size,
        price: size.price ?? product.price,
        stock: size.stock,
      };
      availableStock = size.stock;
      variantId = size._id;
    }

    let colorData = null;
    if (selectedColor?._id) {
      const color = product.availableColors.id(selectedColor._id);
      if (!color) return res.status(400).json({ error: "Color not found" });
      colorData = {
        _id: color._id,
        color: color.color,
        images: color.images || [],
        stock: color.stock,
      };
      availableStock = color.stock;
      variantId = color._id;
    }

    if (quantity > availableStock)
      return res.status(400).json({ error: "Quantity exceeds available stock" });

    const cart = await Cart.findOne({ user: userId });

    const itemData = {
      product: productId,
      variantId,
      quantity,
      selectedSize: sizeData,
      selectedColor: colorData,
      price: sizeData?.price ?? colorData?.price ?? product.price,
    };

    if (cart) {
      const existingItem = cart.items.find(
        (it) =>
          it.product.toString() === productId &&
          it.variantId?.toString() === variantId?.toString()
      );

      if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        if (newQty > availableStock)
          return res.status(400).json({ error: "Not enough stock available" });
        existingItem.quantity = newQty;
      } else {
        cart.items.push(itemData);
      }

      await cart.save();
      const populated = await cart.populate("items.product");
      return res.json(populated);
    } else {
      const newCart = await Cart.create({
        user: userId,
        items: [itemData],
      });
      const populated = await newCart.populate("items.product");
      return res.json(populated);
    }
  } catch (err) {
    console.error("addToCart error:", err.message);
    return res.status(500).json({ error: "Server error" });
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

