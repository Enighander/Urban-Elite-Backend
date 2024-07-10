const express = require("express");
const router = express.Router();
const productController = require("../controller/product.js");
const {
  uploadProduct,
  uploadToCloudinary,
} = require("../middlewares/cloudinary/uploader.jsx");

router
  .get("/search", productController.searchProductByName)
  .get("/best-selling", productController.getBestSellingProduct)
  .get("/:id", productController.getProductById)
  .get("/categories/:category", productController.getProductByCategory)
  .get("/name/:name", productController.getProductByName)
  .get("/discount/flash-sale", productController.getProductFlashSale)
  .get("/", productController.getAllProduct)
  .post("/", uploadProduct, uploadToCloudinary, productController.createProduct)
  .post("/reset-monthly-sold", productController.resetMonthlySold)
  .patch("/:id/sold", productController.updateProductSold)
  .put("/:id", productController.updateProduct)
  .put("/flash-sale/:id", productController.updateProductFlashSale)
  .delete("/:id", productController.deleteProduct);

module.exports = router;
