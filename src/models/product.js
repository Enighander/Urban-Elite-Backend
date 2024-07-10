const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  color: { type: String },
  category: { type: String },
  reviews: [{ type: String }],
  stock: { type: Number },
  soldForThisMonth: { type: String },
  sold: { type: Number, default: 0 },
  soldProductPermonth: {type: Number, default:0}
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Product = mongoose.model("Product", productSchema);

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const sortOrder = sort === "asc" ? 1 : -1;
  const sortField = sortby || "name";
  try {
    const products = await Product.find()
      .sort({ [sortField]: sortOrder })
      .limit(limit)
      .skip(offset);
    return products;
  } catch (error) {
    throw new Error("Error retrieving products: " + error.message);
  }
};

const selectById = async (_id) => {
  try {
    const selectProductId = await Product.findById({ _id });
    return selectProductId;
  } catch (error) {
    throw new Error("Error Selecting Product ID: " + error.message);
  }
};

const searchByName = async (name) => {
  try {
    const searchProduct = await Product.find({
      name: { $regex: new RegExp(name, "i") },
    });
    return searchProduct;
  } catch (error) {
    throw new Error("Error selecting products by name: " + error.message);
  }
};

const selectByName = async (name) => {
  try {
    const selectProductName = await Product.find({ name });
    return selectProductName;
  } catch (error) {
    throw new Error("Error selecting products by name: " + error.message);
  }
};

const selectByFlashSale = async () => {
  try {
    const selectProductDiscount = await Product.find({ discountPrice: { $ne: null } });
    return selectProductDiscount;
  } catch (error) {
    throw new Error("Error selecting products by FlashSale: " + error.message);
  }
};

const selectBySoldPerMonth = async () => {
  try {
    const selectSoldPerMonth = await Product.find( {soldProductPermonth: { $ne: null } });
    return selectSoldPerMonth
  } catch (error) {
    throw new Error("Error selecting products by SoldPerMonth: " + error.message);
  }
};
const selectByCategory = async (category) => {
  try {
    const selectProductCategory = await Product.find({ category });
    return selectProductCategory;
  } catch (error) {
    throw new Error("Error Selecting Category: " + error.message);
  }
};

const insert = async (productData) => {
  try {
    const newProduct = await Product.create(productData);
    return newProduct;
  } catch (error) {
    throw new Error("Error inserting product: " + error.message);
  }
};

const update = async (productId, sendingProductData) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, sendingProductData, {
      new: true,
    });
    return updatedProduct;
  } catch (error) {
    throw new Error("Error updating product: " + error.message);
  }
};

const deleteData = async (_id) => {
  try {
    const result = await Product.deleteOne({ _id });
    return result;
  } catch (error) {
    throw new Error("Error deleting product: " + error.message);
  }
};

const deleteAllData = async () => {
  try {
    const result = await Product.deleteMany({});
    return result;
  } catch (error) {
    throw new Error("Error deleting allProduct: " + error.message);
  }
};

module.exports = {
  Product,
  selectAll,
  selectById,
  selectByCategory,
  selectByName,
  selectByFlashSale,
  selectBySoldPerMonth,
  searchByName,
  insert,
  update,
  deleteData,
  deleteAllData,
};
