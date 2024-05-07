const express = require ("express");
const router = express.Router();
const paymentController = require("../controller/payment.js");


router
.get("/", paymentController.getAllPayment)
.get("/:id", paymentController.getPaymentById)
.post("/", paymentController.createPayment)
.put("/:id", paymentController.updatePayment)
.delete("/:id", paymentController.deletePayment);




module.exports = router;
