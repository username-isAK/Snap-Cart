const Product = require("../schemas/Product");
const Category = require("../schemas/Category");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const images = req.files ? req.files.map((file) => file.path) : [];

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      images,
    });

    let savedProduct = await product.save();
    savedProduct = await savedProduct.populate("category", "name");
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name").sort({ updatedAt: -1 }); 
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, oldImages } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (category) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) return res.status(400).json({ message: "Invalid category ID" });
      product.category = category;
    }

    let imagesToKeep = oldImages ? JSON.parse(oldImages) : [];

    if (req.files && req.files.length > 0) {
      imagesToKeep = imagesToKeep.concat(req.files.map((f) => f.path));
    }

    product.images = imagesToKeep;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;

    const updatedProduct = await product.save();
    await updatedProduct.populate("category", "name");

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
