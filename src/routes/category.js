const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category.js");
const {
    uploadCategory,
    uploadToCloudinary,
} = require ("../middlewares/cloudinary/uploader.jsx")

router
    .get("/:name", categoryController.getCategoryByName)
    .get("/", categoryController.getAllCategory)
    .post("/", uploadCategory, uploadToCloudinary,categoryController.createCategory)
    .put("/:id", categoryController.updateCategory)
    .delete("/:id", categoryController.deleteCategory)


module.exports = router;