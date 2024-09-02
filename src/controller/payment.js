const Payment = require("../models/payment.js");
const stripe = require("../helper/stripe.js");
const { v4: uuidv4 } = require("uuid");

const PaymentController = {
  getAllPayment: async (req, res) => {
    try {
      const { limit = 10, offset = 0, sort = "asc", sortby = "id" } = req.query;
      const PaymentData = await Payment.selectAll({
        limit,
        offset,
        sort,
        sortby,
      });
      res.status(200).json({ success: true, PaymentData });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving Payment list",
        error: error.message,
      });
    }
  },
  getPaymentById: async (req, res) => {
    const PaymentID = req.params.id;
    try {
      const PaymentList = await Payment.selectById(PaymentID);
      if (!PaymentList) {
        return res.status(404).json({
          success: false,
          message: "error Payment list not found or empty",
        });
      }
      res.status(200).json({
        success: true,
        Payment: PaymentList,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error GET Payment by ID",
        error: error.message,
      });
    }
  },
  createPaymentIntent: async (req, res) => {
    const { amount, currency, userId, orderId } = req.body;
    try {
      const newPayment = {
        amount: amount,
        currency: currency,
        metadata: {
          userId: userId,
          orderId: orderId,
        },
      };
      const paymentIntent = await stripe.paymentIntents.create(newPayment);
      return res.status(201).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntents: paymentIntent.id,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error create Payment",
        error: error.message,
      });
    }
  },
  deletePayment: async (req, res) => {
    const PaymentId = req.params.id;
    try {
      const deletePayment = await Payment.deleteData(PaymentId);
      return res.status(201).json({
        success: true,
        message: "User remove data Payment successfully",
        Payment: deletePayment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while delete the data Payment",
        error: error.message,
      });
    }
  },
  deleteAllPayment: async (req, res) => {
    try {
      await Payment.deleteAllPayment();
      res.status(200).json({
        success: true,
        message: "All Payments deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while delete all data Payment",
      });
    }
  },
};

module.exports = PaymentController;
