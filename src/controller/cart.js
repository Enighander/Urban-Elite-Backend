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
  getCartByUsername: async (req, res) => {
    const username = req.params.username;
    try {
      const userCartListItem = await Cart.selectByUsername(username);
      if (!username) {
        return res.statu(404).json({
          success: false,
          message: "error cart list not found or empty",
        });
      }
      res.statue(200).json({
        success: true,
        cart: userCartListItem,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error GET card by username",
        error: error.message,
      });
    }
  },
  createCart: async (req, res) => {
    const {
      username,
      user_id,
      product_id,
      product_name,
      image_product,
      quantity,
      price,
    } = req.body;
    try {
      const existingCartItem = await Cart.findCartItem({ user_id, product_id });

      if (existingCartItem) {
        existingCartItem.quantity += quantity;
        const updatedCartItem = await existingCartItem.save();
        return res.status(200).json({
          success: true,
          message: "Updated cart successfully",
          cart: updatedCartItem,
        });
      } else {
        const cartId = uuidv4();
        const newCart = {
          _id: cartId,
          user_id,
          username,
          product_id,
          product_name,
          image_product,
          quantity,
          price,
        };
        const inputCart = await Cart.insert(newCart);
        return res.status(201).json({
          success: true,
          message: "create cart successfully",
          cart: inputCart,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error create cart",
        error: error.message,
      });
    }
  },
  incrementCartItem: async (req, res) => {
    const { user_id, product_id } = req.body;
    try {
      const existingCartItem = await Cart.findCartItem({ user_id, product_id });
      if (existingCartItem) {
        existingCartItem.quantity += 1;
        await existingCartItem.save();
        const updatedCart = await Cart.findCartItem({ user_id });
        return res.status(200).json({
          success: true,
          message: "Incremented cart item successfully",
          cart: updatedCart,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Cart item not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error incrementing cart item",
        error: error.message,
      });
    }
  },
  decrementCartItem: async (req, res) => {
    const { user_id, product_id } = req.body;
    try {
      const existingCartItem = await Cart.findCartItem({ user_id, product_id });
      if (existingCartItem) {
        if (existingCartItem.quantity > 1) {
          existingCartItem.quantity -= 1;
          await existingCartItem.save();
          const updatedCart = await Cart.findCartItem({ user_id });
          return res.status(200).json({
            success: true,
            message: "Decremented cart item successfully",
            cart: updatedCart,
          });
        } else {
          await Cart.deleteData({ _id: existingCartItem._id });
          const updatedCart = await Cart.findCartItem({ user_id });
          return res.status(200).json({
            success: true,
            message: "Deleted cart item successfully",
            cart: updatedCart,
          });
        }
      } else {
      }
    } catch (error) {}
  },
  updateCart: async (req, res) => {
    const cartId = req.params.id;
    const {
      user_id,
      username,
      product_id,
      product_name,
      quantity,
      price,
      total_price,
    } = req.body;
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
        username,
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
