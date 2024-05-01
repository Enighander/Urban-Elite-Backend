const Payment = require("../models/payment.js")
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
            const paymentList = await Payment.selectById(paymentId)
            if (!paymentList) {
                return res.status(404).json({
                    success: false,
                    message: "error payment list not found or empty"
                });
            }
            res.status(200).json({
                success: true,
                payment: paymentList,
            })
        } catch (error) {
            res.return(500).json({
                success: false,
                message: "error GER payment by ID",
                error: error.message,
            })
        }
    },
    createPayment: async (req, res) => {
        const {
            user_id,
            order_id,
            total_payment,
            status_payment,
        } = req.body;
        try {
            const paymentId = uuidv4();
            const createdAt = new Date();
            const status_pending = "pending"

            const newPayment = {
                _id: paymentId,
                user_id,
                order_id,
                total_payment,
                status_payment: status_pending,
                created_at: createdAt,
            }
            const createPayment = await Payment.insert(newPayment)
            return res.status(201).json({
                success: true,
                message: "create payment successfully",
                shipment: createPayment,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "error create payment",
                error: error.message,
            })
        }
    },
    updatePayment: async (req, res) => {
        const paymentId = req.params.id;
        const {
            total_payment,
            status_payment,
        } = req.body;
        try {
            const existingPaymentData = await Payment.selectById(paymentId);
            if (!existingPaymentData) {
                res.status(404).json({
                    success: false,
                    message: "error payment list not found or empty",
                })
            }
            const sendingPaymentData = {
                total_payment,
                status_payment
            }
            const updatedPayment = await Payment.update(sendingPaymentData);
            return res.status(201).json({
                success: true,
                message: "Payment data updated successfully",
                payment: updatedPayment,
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "An erro occurred while updating the payment",
                error: error.message,
            })
        }
    },
    deletePayment: async (req, res) => {
        const paymentId = req.params.id;
        try {
            const deletePayment = await Payment.deleteData(paymentId)
            return res.status(201).json({
                success: true,
                message: "Payment data deleted successfully",
                payment: deletePayment,
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "An error occured while delete Payment data",
                error: error.message,
            })
        }
    }
}

module.exports = paymentController;