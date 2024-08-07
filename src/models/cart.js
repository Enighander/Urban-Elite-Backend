const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  _id: { type: String },
  username: { type: String },
  user_id: { type: String },
  product_id: { type: String },
  product_name: { type: String },
  image_product: { type: String},
  quantity: { type: Number },
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

const selectByUserId = async (user_id) => {
  try {
    const selectUserId = await Cart.find({ user_id });
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


const findCartItem = async ({user_id, product_id}) => {
  try {
    const selectCartItem = await Cart.findOne({user_id, product_id})
    return selectCartItem
  } catch (error) {
    throw new Error("Error selecting Cart item By product_id")
  }
}

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

module.exports = {
  Cart,
  selectAll,
  selectById,
  selectByUserId,
  selectByUsername,
  findCartItem,
  insert,
  update,
  deleteData,
};
