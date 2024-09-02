const express = require("express");
const router = express.Router();
const PaymentController = require("../controller/payment.js");

router
  .get("/", PaymentController.getAllPayment)
  .get("/:id", PaymentController.getPaymentById)
  // .post("/", PaymentController.createPayment)
  .post("/", PaymentController.createPaymentIntent)
  .delete("/:id", PaymentController.deletePayment)
  .delete("/", PaymentController.deleteAllPayment)

module.exports = router;
