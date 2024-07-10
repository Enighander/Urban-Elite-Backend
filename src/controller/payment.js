const Payment = require("../models/payment.js");
const { v4: uuidv4 } = require("uuid");

const paymentController = {
  getAllPayment: async (req, res) => {
    try {
      const { limit = 10, offset = 0, sort = "asc", sortby = "id" } = req.query;
      const paymentData = await Payment.selectAll({
        limit,
        offset,
        sort,
        sortby,
      });
      res.status(200).json({ success: true, paymentData });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving payment list",
        error: error.message,
      });
    }
  },
  getPaymentById: async (req, res) => {
    const paymentId = req.params.id;
    try {
      const paymentList = await Payment.selectById(paymentId);
      if (!paymentList) {
        return res.status(404).json({
          success: false,
          message: "error payment list not found or empty",
        });
      }
      res.status(200).json({
        success: true,
        payment: paymentList,
      });
    } catch (error) {
      res.return(500).json({
        success: false,
        message: "error GER payment by ID",
        error: error.message,
      });
    }
  },
  createPayment: async (req, res) => {
    const {
      username,
      bank_name,
      card_holder,
      expiration,
      card_number,
    } = req.body;
    try {
      const paymentId = uuidv4();

      const newPayment = {
        _id: paymentId,
        username,
        bank_name,
        card_holder,
        expiration,
        card_number,
      };
      const createPayment = await Payment.insert(newPayment);
      return res.status(201).json({
        success: true,
        message: "create payment successfully",
        payment: createPayment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error create payment",
        error: error.message,
      });
    }
  },
  updatePayment: async (req, res) => {
    const paymentId = req.params.id;
    const { card_holder, expiration, cvv, card_number, bank_name, bank_image } =
      req.body;
    try {
      const existingPaymentData = await Payment.selectById(paymentId);
      if (!existingPaymentData) {
        res.status(404).json({
          success: false,
          message: "error payment list not found or empty",
        });
      }
      const sendingPaymentData = {
        card_holder,
        expiration,
        card_number,
        bank_name,
      };
      const updatedPayment = await Payment.update(sendingPaymentData);
      return res.status(201).json({
        success: true,
        message: "Payment data updated successfully",
        payment: updatedPayment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An erroR occurred while updating the payment",
        error: error.message,
      });
    }
  },
  deletePayment: async (req, res) => {
    const paymentId = req.params.id;
    try {
      const deletePayment = await Payment.deleteData(paymentId);
      return res.status(201).json({
        success: true,
        message: "Payment data deleted successfully",
        payment: deletePayment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while delete Payment data",
        error: error.message,
      });
    }
  },
  deleteAllPayment: async (req, res) => {
    try {
      await Payment.deleteAllPayment();
      res.status(200).json({
        success: true,
        message: "All Payment deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while delete all data payment",
      });
    }
  },
};

module.exports = paymentController;
