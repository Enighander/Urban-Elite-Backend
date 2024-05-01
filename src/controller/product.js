const { v4: uuidv4 } = require("uuid");
const Product = require("../models/product.js");

const productController = {
  getAllProduct: async (req, res) => {
    try {
      const {
        limit = 10,
        offset = 0,
        sort = "asc",
        sortby = "name",
      } = req.query;
      const products = await Product.selectAll({ limit, offset, sort, sortby });
      res.status(200).json({ success: true, products });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving products",
        error: error.message,
      });
    }
  },
  getProductById: async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await Product.selectById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "error Product not found",
        });
      }
      res.status(200).json({
        success: true,
        product: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error GET product by ID",
        error: error.message,
      });
    }
  },
  getProductByCategory: async (req, res) => {
    const categoryId = req.params.category;
    try {
      const category = await Product.selectByCategory(categoryId);
      if (!category) {
        res.status(404).json({
          success: false,
          message: "error category product not found",
        });
      }
      res.status(201).json({
        success: true,
        category: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving products",
        error: error.message,
      });
    }
  },
  searchProductByName: async (req, res) => {
    const productName = req.query.name;
    try {
      const products = await Product.searchByName(productName);
      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      res.status(200).json({
        success: true,
        products: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving products by name",
        error: error.message,
      });
    }
  },
  createProduct: async (req, res) => {
    const productId = uuidv4();
    try {
      const newProduct = await Product.insert({
        _id: productId,
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        category: req.body.category,
        color: req.body.color,
        reviews: req.body.reviews,
      });
      res.status(201).json({
        success: true,
        message: "addProduct Successfully",
        product: newProduct,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error addProduct",
        error: error.message,
      });
    }
  },
  updateProduct: async (req, res) => {
    const productId = req.params.id;
    try {
      const newData = {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        category: req.body.category,
        color: req.body.color
      };
      const updatedProduct = await Product.update(productId, newData);
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating product",
        error: error.message,
      });
    }
  },
  deleteProduct: async (req, res) => {
    const productId = req.params.id;
    try {
      await Product.deleteData(productId);
      res.status(201).json({
        success: true,
        message: "Product Deleted Successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error deleteProduct",
        error: error.message,
      });
    }
  },
  deleteAllProduct: async (req, res) => {
    try {
      await Product.deleteAllData();
      res.status(200).json({
        success: true,
        message: "All products deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting products",
        error: error.message,
      });
    }
  },
};

module.exports = productController;
