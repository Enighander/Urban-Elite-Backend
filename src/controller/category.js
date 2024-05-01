const { v4: uuidv4 } = require("uuid");
const Category = require("../models/category.js");

const categoryController = {
  getAllCategory: async (req, res) => {
    try {
      const {
        limit = 10,
        offset = 0,
        sort = "asc",
        sortby = "name",
      } = req.query;
      const categories = await Category.selectAll({
        limit,
        offset,
        sort,
        sortby,
      });
      res.status(200).json({ success: true, categories });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving categories",
        error: error.message,
      });
    }
  },
  getCategoryByName: async (req, res) => {
    const categoryName = req.params.name;
    try {
      const category = await Category.selectByName(categoryName);
      res.status(200).json({
        success: true,
        category: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error GET category by Name",
        error: error.message,
      });
    }
  },
  getCategoryById: async (req, res) => {
    const categoryId = req.params.id;
    try {
      const category = await Category.selectById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "error Category not found",
        });
      }
      res.status(200).json({
        success: true,
        category: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error GET category by ID",
        error: error.message,
      });
    }
  },
  createCategory: async (req, res) => {
    const categoryId = uuidv4();
    try {
      const newCategory = await Category.insert({
        _id: categoryId,
        name: req.body.name,
        image: req.body.image,
      });
      res.status(201).json({
        success: true,
        message: "addCategory Successfully",
        category: newCategory,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error addCategory",
        error: error.message,
      });
    }
  },
  updateCategory: async (req, res) => {
    const categoryId = req.params.id;
    try {
      const newData = {
        name: req.body.name,
        image: req.body.image,
      };
      const updatedCategory = await Category.update(categoryId, newData);
      if (!updatedCategory) {
        res.status(404).json({
          success: false,
          message: "error category not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category: updatedCategory,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating category",
        error: error.message,
      });
    }
  },
  deleteCategory: async (req, res) => {
    const categoryId = req.params.id;
    try {
      await Category.deleteData(categoryId);
      res.status(201).json({
        success: true,
        message: "Product Deleted Successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error deleteCategory",
        error: error.message,
      });
    }
  },
};

module.exports = categoryController;
