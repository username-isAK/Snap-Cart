const Order = require("../schemas/Order");
const Product = require("../schemas/Product");
const Cart = require("../schemas/Cart");
const mongoose = require("mongoose");

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { products, totalPrice, status, paymentMethod, address } = req.body;

    if (!products || products.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Products array is required" });
    }

    if (!address || !address.fullName || !address.phone) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Address and phone are required" });
    }

    for (const item of products) {
      const prod = await Product.findById(item.product).session(session);
      if (!prod) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ error: `Product not found: ${item.product}` });
      }
      if (prod.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: `Insufficient stock for ${prod.name}` });
      }
    }

    for (const item of products) {
      const prod = await Product.findById(item.product).session(session);
      prod.stock -= item.quantity;
      await prod.save({ session });
    }

    const order = new Order({
      user: req.user.id,
      products,
      totalPrice,
      status: status || "Pending",
      paymentMethod: paymentMethod || "COD",
      address,
    });

    const savedOrder = await order.save({ session });

    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { items: [] } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    await savedOrder.populate("products.product", "name price");

    return res.status(201).json(savedOrder);
  } catch (error) {
    console.error("createOrder error:", error);
    try {
      await session.abortTransaction();
    } catch (e) {}
    session.endSession();
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("products.product", "name price category")
      .populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price category");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true })
      .populate("user", "name email")
      .populate("products.product", "name price category");

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
