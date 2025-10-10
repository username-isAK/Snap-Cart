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

    const specs = specifications ? JSON.parse(specifications) : {};
    const sizes = availableSizes ? JSON.parse(availableSizes) : [];
    const colors = availableColors ? JSON.parse(availableColors) : [];
    const variantList = variants ? JSON.parse(variants) : [];

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const files = req.files || [];
    const mainImages = [];
    const colorImagesMap = {};

    files.forEach((file) => {
      const field = file.fieldname;

      if (field === "images") {
        mainImages.push(file.path.replace(/\\/g, "/"));
      }

      const match = field.match(/^colorImages_(\d+)_\d+$/);
      if (match) {
        const colorIndex = parseInt(match[1]);
        if (!colorImagesMap[colorIndex]) colorImagesMap[colorIndex] = [];
        colorImagesMap[colorIndex].push(file.path.replace(/\\/g, "/"));
      }
    });

    const colorsWithImages = colors.map((color, i) => ({
      ...color,
      images: colorImagesMap[i] || [],
    }));

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      specifications: specs,
      availableSizes: sizes,
      availableColors: colorsWithImages,
      variants: variantList,
      images: mainImages, 
    });

    await product.save();
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
      stock,
      category,
      specifications,
      availableColors,
      availableSizes,
      variants,
      oldImages,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updatedData = {
      name,
      description,
      price,
      stock,
      specifications: specifications ? JSON.parse(specifications) : {},
      availableColors: availableColors ? JSON.parse(availableColors) : [],
      availableSizes: availableSizes ? JSON.parse(availableSizes) : [],
      variants: variants ? JSON.parse(variants) : [],
      images: oldImages ? JSON.parse(oldImages) : [],
    };

    if (category) {
      updatedData.category = category;
    }

    const colorImagesMap = {};
    (req.files || []).forEach((file) => {
      const match = file.fieldname.match(/colorImages_(\d+)_\d+/);
      if (match) {
        const colorIndex = parseInt(match[1]);
        if (!colorImagesMap[colorIndex]) colorImagesMap[colorIndex] = [];
        colorImagesMap[colorIndex].push(file.path.replace(/\\/g, "/"));
      } else if (file.fieldname === "images") {
        updatedData.images.push(file.path.replace(/\\/g, "/"));
      }
    });

    const parsedColors = updatedData.availableColors
      .map((c, i) => ({
        ...c,
        images: [
          ...(c.images || []),
          ...(colorImagesMap[i] || []),
        ],
      }))
      .filter(c => c.color && c.color.trim() !== "");

    updatedData.availableColors = parsedColors;

    if (!category || category === "") delete updatedData.category;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    ).populate("category", "name");

    res.json(updatedProduct);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
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
