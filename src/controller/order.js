const Order = require("../models/order.js");
const { v4: uuidv4 } = require("uuid");
const Cart = require("../models/cart.js");

const orderController = {
  getAllOrder: async (req, res) => {
    try {
      const { limit = 10, offset = 0, sort = "asc", sortby = "id" } = req.query;
      const orders = await Order.selectAll({ limit, offset, sort, sortby });
      res.status(200).json({ success: true, orders });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving all orders data",
        error: error.message,
      });
    }
  },
  getOrderById: async (req, res) => {
    const orderId = req.params.id;
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "error order not found or empty",
        });
      }
      res.status(200).json({
        success: true,
        order: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error GET order by ID",
        error: error.message,
      });
    }
  },
  getOrderByUserId: async (req, res) => {
    const userId = req.params.userId;
    try {
      const order = await Order.findByUserId(userId);
      if (!userId) {
        return res.status(404).json({
          success: false,
          message: "error order not found or empty",
        });
      }
      res.status(200).json({
        success: true,
        order: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error GET order by ID",
        error: error.message,
      });
    }
  },
  getOrderByUsername: async (req, res) => {
    const username = req.params.username;
    try {
      const order = await Order.findByUsername(username);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "error order not found or empty",
        });
      }
      res.status(200).json({
        success: true,
        order: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error GET order by ID",
        error: error.message,
      });
    }
  },
  createOrder: async (req, res) => {
    const { userId, username, paymentMethod, totalPrice } = req.body;
    const orderId = uuidv4();
    const pendingStatus = "pending";
    const createdAt = new Date();
    try {
      const cartItems = await Cart.selectByUserId(userId);
      if (!cartItems || cartItems.length === 0) {
        return res
          .status(400)
          .json({ message: "the cart was empty, can't make an order" });
      }
      const products = cartItems.map((item) => ({
        productId: item.productId,
        product_name: item.product_name,
        image_product: item.image_product,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        price: item.price,
      }));
      const createOrderData = {
        _id: orderId,
        userId,
        username,
        products,
        paymentMethod,
        totalPrice,
        paymentStatus: pendingStatus,
        created_at: createdAt,
      };

      const createdOrder = await Order.createOrder(createOrderData);
      console.log("Order created:", createOrderData);

      await Cart.deleteCartByUserId(userId);

      // Send success response back to the client
      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        order: createdOrder,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the order",
        error: error.message,
      });
    }
  },
  updateStatusOrder: async (req, res) => {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;
    try {
      if (!["pending", "paid", "failed"].includes(paymentStatus)) {
        return res.status(400).json({ message: "Status Payment not Valid" });
      }
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        paymentStatus
      );
      if (!updatedOrder) {
        return res.status(404).json({ message: "the order was not found" });
      }
      return res.status(200).json({
        success: true,
        message: `status payment change to ${paymentStatus}`,
        order: updatedOrder,
      });
    } catch (error) {
      console.error("Error updating payment status:", error.message);
      return res.status(500).json({
        success: false,
        message: "An error occurred while update status order",
        error: error.message,
      });
    }
  },
  deleteOrder: async (req, res) => {
    const orderId = req.params.id;
    try {
      const deleteOrder = await Order.deleteOrder(orderId);
      return res.status(201).json({
        success: true,
        message: "order deleted successfully",
        order: deleteOrder,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleted the order",
        error: error.message,
      });
    }
  },
};

module.exports = orderController;
