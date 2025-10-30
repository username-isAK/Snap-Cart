const Order = require("../schemas/Order");
const Product = require("../schemas/Product");
const Cart = require("../schemas/Cart");
const mongoose = require("mongoose");

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { products, totalPrice, status, paymentMethod, address } = req.body;
    if (!products?.length) throw new Error("Products array is required");

    const orderProducts = [];
    
    for (const item of products) {
      const product = await Product.findById(item.product).session(session);
      if (!product) throw new Error(`Product not found: ${item.product}`);

      let itemPrice = item.price ?? product.price;
      let sizevariantId = null;
      let colourvariantId = null;
      let sizeData = item.selectedSize || null;
      let colorData = item.selectedColor || null;

      if (item.selectedSize?._id) {
        const size = product.availableSizes.id(item.selectedSize._id);
        if (!size) throw new Error(`Size not found for ${product.name}`);
        if (size.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name} (${size.size})`);
        size.stock -= item.quantity;
        sizevariantId = size._id;
        itemPrice = size.price ?? itemPrice;
      }

      if (item.selectedColor?._id) {
        const color = product.availableColors.id(item.selectedColor._id);
        if (!color) throw new Error(`Color not found for ${product.name}`);
        if (color.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name} (${color.color})`);
        color.stock -= item.quantity;
        colourvariantId = color._id;
      }

      if (product.stock < item.quantity)
        throw new Error(`Insufficient stock for ${product.name}`);
      product.stock -= item.quantity;

      await product.save({ session });

      orderProducts.push({
        product: product._id,
        sizevariantId,
        colourvariantId,
        quantity: item.quantity,
        price: itemPrice,
        selectedSize: sizeData,
        selectedColor: colorData,
      });
    }

    const order = new Order({
      user: req.user.id,
      products: orderProducts,
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

    await savedOrder.populate("products.product", "name images");

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("createOrder error:", err.message);
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
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
