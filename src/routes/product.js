const express = require("express");
const router = express.Router();
const productController = require("../controller/product.js");

router
  .get("/search", productController.searchProductByName)
  .get("/:id", productController.getProductById)
  .get("/categories/:category",productController.getProductByCategory)
  .get("/", productController.getAllProduct)
  .post("/", productController.createProduct)
  .put("/:id", productController.updateProduct)
  .delete("/:id", productController.deleteProduct);

module.exports = router;
