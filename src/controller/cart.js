const Cart = require("../models/cart.js");
const { v4: uuidv4 } = require("uuid");

const cartController = {
  getAllCarts: async (req, res) => {
    try {
      const { limit = 10, offset = 0, sort = "asc", sortby = "id" } = req.query;
      const cartList = await Cart.selectAll({ limit, offset, sort, sortby });
      res.status(200).json({ success: true, cartList });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving cart list",
        error: error.message,
      });
    }
  },
  getCartById: async (req, res) => {
    const cartId = req.params.id;
    try {
      const cartProductList = await Cart.selectById(cartId);
      if (!cartProductList) {
        return res.status(404).json({
          success: false,
          message: "error cart list not found or empty",
        });
      }
      res.status(200).json({
        success: true,
        cart: cartProductList,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error GET cart by ID",
        error: error.message,
      });
    }
  },
  getCartByUserID: async (req, res) => {
    const userID = req.params.user_id;
    try {
      const userList = await Cart.selectByUserId(userID);
      if (!userList) {
        return res.status(404).json({
          success: false,
          message: "error cart list not found or empty",
        });
      }
      res.status(200).json({
        success: true,
        cart: userList,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error GET cart by ID",
        error: error.message,
      });
    }
  },
  createCart: async (req, res) => {
    const { user_id, product_id, product_name, quantity, price, total_price } =
      req.body;
    try {
      const cartId = uuidv4();
      const newCart = {
        _id: cartId,
        user_id,
        product_id,
        product_name,
        quantity,
        price,
        total_price,
      };
      const inputCart = await Cart.insert(newCart);
      return res.status(201).json({
        success: true,
        message: "create cart successfully",
        cart: inputCart,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error create cart",
        error: error.message,
      });
    }
  },
  updateCart: async (req, res) => {
    const cartId = req.params.id;
    const { user_id, product_id, product_name, quantity, price, total_price } =
      req.body;
    try {
      const existingCartList = await Cart.selectById(cartId);
      if (!existingCartList) {
        res.status(404).json({
          success: false,
          message: "error cart product list not found or empty",
        });
      }
      const sendingCartData = {
        user_id,
        product_id,
        product_name,
        quantity,
        price,
        total_price,
      };
      const updatedCart = await Cart.update(sendingCartData);
      return res.status(201).json({
        success: true,
        message: "Cart list Updated Successfully",
        user: updatedCart,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the cart",
        error: error.message,
      });
    }
  },
  deleteCart: async (req, res) => {
    const cartId = req.params.id;
    try {
      const deleteCartList = await Cart.deleteData(cartId);
      return res.status(201).json({
        success: true,
        message: "Cart Products list deleted successfully",
        user: deleteCartList,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while deactivated the account",
        error: error.message,
      });
    }
  },
};

module.exports = cartController;
