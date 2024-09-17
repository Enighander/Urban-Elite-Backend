const { v4: uuidv4 } = require("uuid");
const Cart = require("../models/cart.js");
const Order = require("../models/order.js");
const { createTransaction } = require("../services/midtrans.js");

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
  getMidtransToken: async (req, res) => {
    try {
      const { orderId } = req.body;
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      const midtransToken = order.midtransToken;
      if (!midtransToken) {
        return res.status(400).json({
          success: false,
          message: "Midtrans token not found for this order",
        });
      }
      return res.status(200).json({
        success: true,
        midtransToken,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while retrieving the Midtrans token",
        error: error.message,
      });
    }
  },
  createOrder: async (req, res) => {
    const { userId, username, totalPrice } = req.body;
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
        totalPrice,
        paymentStatus: pendingStatus,
        created_at: createdAt,
      };

      const midtransTransaction = await createTransaction(
        orderId,
        totalPrice,
        products,
        { username, email: req.body.email, phone_number: req.body.phone_number }
      );

      createOrderData.midtransToken = midtransTransaction.token;

      const createdOrder = await Order.createOrder(createOrderData);

      console.log("Midtrans transactions response:", midtransTransaction);

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        order: createdOrder,
        midtransToken: midtransTransaction.token,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the order",
        error: error.message,
      });
    }
  },
  updateStatusOrderMidtrans: async (req, res) => {
    try {
      const notification = req.body;
      const orderId = notification.order_id;
      const transactionStatus = notification.transaction_status;
      const fraudStatus = notification.fraud_status;

      const order = await Order.findById(orderId);

      if (!orderId) {
        return res.status(404).json({ message: "order not found" });
      }
      if (transactionStatus === "settlement" && fraudStatus === "accept") {
        order.paymentStatus = "paid";
        await Cart.deleteCartByUserId(order.userId);
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "expire" ||
        transactionStatus === "deny"
      ) {
        order.paymentStatus = "failed";
      } else if (transactionStatus === "pending") {
        order.paymentStatus = "pending";
      }
      await order.save();
      console.log(req.body);
      return res.status(200).json({
        message: "notification processed successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing the notification",
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
  deleteAllOrder: async (req, res) => {
    try {
      await Order.deleteAllOrder();
      res.status(200).json({
        success: true,
        message: "all order data deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting orders",
        error: error.message,
      });
    }
  },
};

module.exports = orderController;
