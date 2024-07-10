const Order = require("../models/order.js");
const { v4: uuidv4 } = require("uuid");

const OrderController = {
  getAllOrder: async (req, res) => {
    try {
      const { limit = 10, offset = 0, sort = "asc", sortby = "id" } = req.query;
      const OrderData = await Order.selectAll({
        limit,
        offset,
        sort,
        sortby,
      });
      res.status(200).json({ success: true, OrderData });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving Order list",
        error: error.message,
      });
    }
  },
  getOrderById: async (req, res) => {
    const OrderID = req.params.id;
    try {
      const OrderList = await Order.selectById(OrderID);
      if (!OrderList) {
        return res.status(404).json({
          success: false,
          message: "error Order list not found or empty",
        });
      }
      res.status(200).json({
        success: true,
        Order: OrderList,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error GET Order by ID",
        error: error.message,
      });
    }
  },
  createOrder: async (req, res) => {
    const { cart_id, username, address_id, quantity, total_price } = req.body;
    try {
      const OrderId = uuidv4();
      const createdAt = new Date();
      const pendingStatus = "pending";

      const newOrder = {
        _id: OrderId,
        cart_id,
        username,
        address_id,
        quantity,
        total_price,
        status_order: pendingStatus,
        created_at: createdAt,
      };
      const createOrder = await Order.insert(newOrder);
      return res.status(201).json({
        success: true,
        message: "create Order successfully",
        Order: createOrder,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error create Order",
        error: error.message,
      });
    }
  },
  updateOrderAsPaid: async (req, res) => {
    const OrderId = req.params.id;
    try {
      const existingOrderList = await Order.selectById(OrderId);
      if (!existingOrderList) {
        res.status(404).json({
          success: false,
          message: "error Order list not found or empty",
        });
      }

      const paidStatus = "paid";
      const createdAt = new Date();

      const sendingOrderData = {
        status_order: paidStatus,
        created_at: createdAt,
      };
      const updatedOrder = await Order.update(sendingOrderData);
      return res.status(201).json({
        success: true,
        message: "Order Status order changed into Paid",
        Order: updatedOrder,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the Order into as paid",
        error: error.message,
      });
    }
  },
  updateOrderAsProgressDelivery: async (req, res) => {
    const OrderId = req.params.id;
    try {
      const existingOrderList = await Order.selectById(OrderId);
      if (!existingOrderList) {
        res.status(404).json({
          success: false,
          message: "error Order list not found or empty",
        });
      }
      const deliveryStatus = "delivered";
      const createdAt = new Date();

      const sendingOrderData = {
        status_order: deliveryStatus,
        created_at: createdAt,
      };
      const updateOrder = await Order.update(sendingOrderData);
      return res.status(201).json({
        success: true,
        message: "Order Status order change into delivery",
        Order: updateOrder,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "An error occurred while updating the Order into progress delivery",
        error: error.message,
      });
    }
  },
  updateOrderAsArrived: async (req, res) => {
    const OrderId = req.params.id;
    try {
      const existingOrderList = await Order.selectAll(OrderId);
      if (!existingOrderList) {
        res.status(404).json({
          success: false,
          message: "error Order list not found or empty",
        });
      }

      const deliveryStatus = "Arrived";
      const createdAt = new Date();

      const sendingOrderData = {
        status_order: deliveryStatus,
        created_at: createdAt,
      };
      const updatedOrder = await Order.update(sendingOrderData);
      return res.status(201).json({
        success: true,
        message: "Order Status order changed into Arrived",
        Order: updatedOrder,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the Order into as paid",
        error: error.message,
      });
    }
  },
  deleteOrder: async (req, res) => {
    const OrderId = req.params.id;
    try {
      const deleteOrder = await Order.deleteData(OrderId);
      return res.status(201).json({
        success: true,
        message: "User remove data Order successfully",
        Order: deleteOrder,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while delete the data Order",
        error: error.message,
      });
    }
  },
  deleteAllOrder: async (req, res) => {
    try {
      await Order.deleteAllOrder();
      res.status(200).json({
        success: true,
        message: "All Orders deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while delete all data Order",
      });
    }
  },
};

module.exports = OrderController;
