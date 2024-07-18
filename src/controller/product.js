const { v4: uuidv4 } = require("uuid");
const Product = require("../models/product.js");
const cloudinary = require("../middlewares/cloudinary/cloudinary.js");
const redisClient = require("../middlewares/redis/redis.js");
const Joi = require("joi");
const path = require("path");


const productController = {
  getAllProduct: async (req, res) => {
    try {
      const {
        limit = 100,
        offset = 0,
        sort = "asc",
        sortby = "name",
      } = req.query;

      const cacheData = await redisClient.get("allProducts");
      if (cacheData) {
        const products = JSON.parse(cacheData);
        return res.status(200).json({
          success: true,
          products: products.slice(offset, offset + parseInt(limit)),
        });
      } else {
        const products = await Product.selectAll({
          limit: parseInt(limit),
          offset: parseInt(offset),
          sort,
          sortby,
        });

        await redisClient.setEx("allProducts", 3600, JSON.stringify(products));
        return res.status(200).json({
          success: true,
          products: products.slice(offset, offset + parseInt(limit)),
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error retrieving products",
        error: error.message,
      });
    }
  },
  getProductById: async (req, res) => {
    const cacheData = await redisClient.get("productId");
    if (cacheData) {
      return res.status(200).json({
        success: true,
        products: JSON.parse(cacheData),
      });
    } else {
      const productId = req.params.id;
      try {
        const product = await Product.selectById(productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: "Product not found",
          });
        }
        await redisClient.setEx("productId", 3600, JSON.stringify(product));
        return res.status(200).json({
          success: true,
          product: product,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "error retrieving product",
          error: error.message,
        });
      }
    }
  },
  getProductByName: async (req, res) => {
    const productName = req.params.name.replace(/-/g, " ");
    try {
      const cacheData = await redisClient.get(`productName:${productName}`);
      if (cacheData) {
        return res.status(200).json({
          success: true,
          product: JSON.parse(cacheData),
        });
      } else {
        const product = await Product.selectByName(productName);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: "Product not found",
          });
        }
        await redisClient.setEx(
          `productName:${productName}`,
          3600,
          JSON.stringify(product)
        );
        return res.status(200).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error retrieving product by name",
        error: error.message,
      });
    }
  },
  getProductByCategory: async (req, res) => {
    const category = req.params.category;
    try {
      const cacheData = await redisClient.get(`productCategory:${category}`);
      if (cacheData) {
        return res.status(200).json({
          success: true,
          products: JSON.parse(cacheData),
        });
      } else {
        const products = await Product.selectByCategory(category);
        if (!products || products.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No products found in this category",
          });
        }
        await redisClient.setEx(
          `productCategory:${category}`,
          3600,
          JSON.stringify(products)
        );
        return res.status(200).json({
          success: true,
          products,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error retrieving products by category",
        error: error.message,
      });
    }
  },
  getProductFlashSale: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit, 10);
      const cacheData = await redisClient.get("flashSaleProducts");
      if (cacheData) {
        const products = JSON.parse(cacheData);
        return res.status(200).json({
          success: true,
          products: products.slice(0, limit),
        });
      } else {
        const productOnSale = await Product.selectByFlashSale();
        if (!productOnSale || productOnSale.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No flash sale products found",
          });
        }
        await redisClient.setEx(
          "flashSaleProducts",
          3600,
          JSON.stringify(productOnSale)
        );
        return res.status(200).json({
          success: true,
          products: products.slice(0, limit),
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error retrieving flash sale products",
        error: error.message,
      });
    }
  },
  getBestSellingProduct: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit, 10) || 5;
      const cacheData = await redisClient.get("bestSellingProduct");
      if (cacheData) {
        const products = JSON.parse(cacheData);
        return res.status(200).json({
          success: true,
          products: products.slice(0, limit),
        });
      } else {
        const productsBestSale = await Product.selectBySoldPerMonth();
        if (!productsBestSale || productsBestSale.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No Best Selling products found",
          });
        }
        await redisClient.setEx(
          "bestSellingProduct",
          3600,
          JSON.stringify(productsBestSale)
        );
        return res.status(200).json({
          success: true,
          products: productsBestSale.slice(0, limit),
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error retrieving best sale products",
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
    const { name, description, price, category, color, reviews } = req.body;

    try {
      let image = "";
      let stock = 1;
      if (req.file && req.file.filename) {
        const imagePath = path.join("UrbanElite", "Product", req.file.filename);
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: imagePath.replace(/\\/g, "/"),
          overwrite: true,
        });
        image = result.secure_url;
      }

      const newProduct = {
        _id: productId,
        name,
        description,
        image,
        price,
        category,
        color,
        reviews,
        stock,
      };

      const createProduct = await Product.insert(newProduct);
      return res.status(201).json({
        success: true,
        message: "add product successfully",
        product: createProduct,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error add product",
        error: error.message,
      });
    }
  },
  updateProduct: async (req, res) => {
    const productId = req.params.id;
    const { name, description, image, price, category, color, stock, sold } =
      req.body;
    try {
      const sendingProductData = {
        name,
        description,
        image,
        price,
        category,
        color,
        stock,
        sold,
      };
      const updatedProduct = await Product.update(
        productId,
        sendingProductData
      );
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
  updateProductFlashSale: async (req, res) => {
    const productId = req.params.id;
    const { discountPercentage } = req.body;

    try {
      const product = await Product.selectById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      const discountPrice =
        product.price - product.price * (discountPercentage / 100);

      const updatedProduct = await Product.update(productId, {
        discountPrice,
      });
      res.status(200).json({
        success: true,
        message: "Product price updated for flash sale",
        product: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating product price for flash sale",
        error: error.message,
      });
    }
  },
  updateProductSold: async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await Product.selectById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      product.sold += 1;
      product.soldProductPermonth += 1;
      await product.save();
      res.status(200).json({ message: "Product sold count updated", product });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating product sold count",
        error: error.message,
      });
    }
  },
  resetMonthlySold: async (req, res) => {
    try {
      await Product.updateMany({}, { soldProductPerMonth: 0 });
      res
        .status(200)
        .json({ message: "Monthly sold count reset for all products" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error resetting monthly sold count", error });
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
