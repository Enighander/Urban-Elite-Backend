const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category.js");

router
    .get("/:name", categoryController.getCategoryByName)
    .get("/", categoryController.getAllCategory)
    .post("/", categoryController.createCategory)
    .put("/:id", categoryController.updateCategory)
    .delete("/:id", categoryController.deleteCategory)


module.exports = router;