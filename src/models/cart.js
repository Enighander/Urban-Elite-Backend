const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  _id: { type: String },
  username: { type: String },
  userId: { type: String },
  productId: { type: String },
  product_name: { type: String },
  image_product: { type: String },
  quantity: { type: Number },
  color: { type: String },
  size: { type: String },
  price: { type: Number },
});

const Cart = mongoose.model("Cart", cartSchema);

const selectAll = async ({ limit, offset, sort, sortby }) => {
  const sortOrder = sort === "asc" ? 1 : -1;
  const sortField = sortby || "_id";
  try {
    const cart = await Cart.find()
      .sort({ [sortField]: sortOrder })
      .limit(limit)
      .skip(offset);
    return cart;
  } catch (error) {
    throw new Error("Error retrieving user: " + error.message);
  }
};

const selectById = async (_id) => {
  try {
    const selectId = await Cart.findById({ _id });
    return selectId;
  } catch (error) {
    throw new Error("error Selecting Cart by ID: " + error.message);
  }
};

const selectByUserId = async (userId) => {
  try {
    const selectUserId = await Cart.find({ userId });
    return selectUserId;
  } catch (error) {
    throw new Error("error Selecting Cart by user ID: " + error.message);
  }
};

const selectByUsername = async (username) => {
  try {
    const selectUsername = await Cart.findOne({ username });
    return selectUsername;
  } catch (error) {
    throw new Error("ERROR Selecting cart by username: " + error.message);
  }
};

const findCartItem = async ({ userId, productId }) => {
  try {
    const selectCartItem = await Cart.findOne({ userId, productId });
    return selectCartItem;
  } catch (error) {
    throw new Error("Error selecting Cart item By productId");
  }
};

const findByUserId = async (userId) => {
  try {
    const findUserId = await Cart.findOne({ userId });
    return findUserId;
  } catch (error) {
    throw new Error("Error finding cart by user ID");
  }
};

const insert = async (cartData) => {
  try {
    const newCart = await Cart.create(cartData);
    return newCart;
  } catch (error) {
    throw new Error("Error input cart data: " + error.message);
  }
};

const update = async (cartData) => {
  try {
    const updateCart = await Cart.updateOne(cartData);
    return updateCart;
  } catch (error) {
    throw new Error("Error update cart data: " + error.message);
  }
};

const deleteData = async (_id) => {
  try {
    const deleteCart = await Cart.deleteOne({ _id });
    return deleteCart;
  } catch (error) {
    throw new Error("Error delete cart data: " + error.message);
  }
};

const deleteCartByUserId = async (userId) => {
  try {
    const deleteCart = await Cart.deleteMany({ userId });
    return deleteCart;
  } catch (error) {
    throw new Error("Error delete cart data: " + error.message);
  }
};

module.exports = {
  Cart,
  selectAll,
  selectById,
  selectByUserId,
  selectByUsername,
  findCartItem,
  findByUserId,
  insert,
  update,
  deleteData,
  deleteCartByUserId
};
