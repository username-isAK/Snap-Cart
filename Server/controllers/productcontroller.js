const Product = require("../schemas/Product");
const Category = require("../schemas/Category");
const path = require("path");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      specifications,
      availableSizes,
      availableColors,
      variants,
    } = req.body;

    const existingCategory = await Category.findById(category);
    if (!existingCategory)
      return res.status(400).json({ message: "Invalid category ID" });

    const images = req.files?.images
      ? req.files.images.map(f => f.path.replace(/\\/g, "/"))
      : [];

    const parsedColors = availableColors ? JSON.parse(availableColors) : [];
    Object.keys(req.files || {}).forEach(field => {
      if (field.startsWith("colorImages_")) {
        const parts = field.split("_");
        const colorIndex = parseInt(parts[1]);
        if (!parsedColors[colorIndex].images) parsedColors[colorIndex].images = [];
        parsedColors[colorIndex].images.push(...req.files[field].map(f => f.path.replace(/\\/g, "/")));
      }
    });

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      images,
      specifications: specifications ? JSON.parse(specifications) : {},
      availableSizes: availableSizes ? JSON.parse(availableSizes) : [],
      availableColors: parsedColors,
      variants: variants ? JSON.parse(variants) : [],
    });

    const savedProduct = await product.save();
    await savedProduct.populate("category", "name");

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ updatedAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      oldImages,
      specifications,
      availableSizes,
      availableColors,
      variants,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (category) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory)
        return res.status(400).json({ message: "Invalid category ID" });
      product.category = category;
    }

    let imagesToKeep = oldImages ? JSON.parse(oldImages) : [];
    if (req.files?.images) imagesToKeep.push(...req.files.images.map(f => f.path.replace(/\\/g, "/")));
    product.images = imagesToKeep;

    const parsedColors = availableColors ? JSON.parse(availableColors) : [];
    Object.keys(req.files || {}).forEach(field => {
      if (field.startsWith("colorImages_")) {
        const parts = field.split("_");
        const colorIndex = parseInt(parts[1]);
        if (!parsedColors[colorIndex].images) parsedColors[colorIndex].images = [];
        parsedColors[colorIndex].images.push(...req.files[field].map(f => f.path.replace(/\\/g, "/")));
      }
    });
    product.availableColors = parsedColors;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;

    if (specifications) product.specifications = JSON.parse(specifications);
    if (availableSizes) product.availableSizes = JSON.parse(availableSizes);
    if (variants) product.variants = JSON.parse(variants);

    const updatedProduct = await product.save();
    await updatedProduct.populate("category", "name");

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
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
