const express = require("express");
const router = express.Router();
const OrderController = require("../controller/order.js");

router
  .get("/", OrderController.getAllOrder)
  .get("/:id", OrderController.getOrderById)
  .post("/", OrderController.createOrder)
  .put("/:id/paid", OrderController.updateOrderAsPaid)
  .put("/:id/delivered", OrderController.updateOrderAsProgressDelivery)
  .put("/:id/arrived", OrderController.updateOrderAsArrived)
  .delete("/:id", OrderController.deleteOrder)
  .delete("/", OrderController.deleteAllOrder)

module.exports = router;
