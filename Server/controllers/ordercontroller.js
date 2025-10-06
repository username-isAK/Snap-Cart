const Order = require("../schemas/Order");

exports.createOrder = async (req, res) => {
  try {
    const { products, totalPrice, status, paymentMethod, address } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "Products array is required" });
    }

    if (!address || !address.fullName || !address.phone) {
      return res.status(400).json({ error: "Address and phone are required" });
    }

    const order = new Order({
      user: req.user.id,
      products,
      totalPrice,
      status: status || "Pending",
      paymentMethod: paymentMethod || "COD",
      address,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
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
