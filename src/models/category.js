const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String },
  image: { type: String },
});

const Category = mongoose.model("Category", categorySchema);

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const sortOrder = sort === "asc" ? 1 : -1;
  const sortField = sortby || "name";
  try {
    const categories = await Category.find()
      .sort({ [sortField]: sortOrder })
      .limit(limit)
      .skip(offset);
    return categories;
  } catch (error) {
    throw new Error("Error retrieving categories: " + error.message);
  }
};
const selectById = async (_id) => {
  try {
    const selectCategoryId = await Category.findById({ _id });
    return selectCategoryId;
  } catch (error) {
    throw new Error("Error Selecting Category ID: " + error.message);
  }
};
const selectByName = async (name) => {
  try {
    const selectCategoryByName = await Category.findOne({ name });
    return selectCategoryByName;
  } catch (error) {
    throw new Error("Error Selecting Category Name: " + error.message);
  }
};
const insert = async (categoryData) => {
  try {
    const newCategory = await Category.create(categoryData);
    return newCategory;
  } catch (error) {
    throw new Error("Error creating category: " + error.message);
  }
};
const update = async (categoryId, newData) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      newData,
      {
        new: true,
      }
    );
    return updatedCategory;
  } catch (error) {
    throw new Error("Error updating category: " + error.message);
  }
};
const deleteData = async (_id) => {
  try {
    const result = await Category.deleteOne({ _id });
    return result;
  } catch (error) {
    throw new Error("Error deleting product: " + error.message);
  }
};

module.exports = {
  Category,
  selectAll,
  selectByName,
  selectById,
  insert,
  update,
  deleteData,
};
