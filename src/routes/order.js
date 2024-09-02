const express = require("express");
const router = express.Router();
const orderController = require("../controller/order");

router
  .get("/:id", orderController.getOrderById)
  .get("/username/:username", orderController.getOrderByUsername)
  .get("/UUID/:userId", orderController.getOrderByUserId)
  .patch("/updatePaymentStatus/:orderId", orderController.updateStatusOrder)
  .get("/", orderController.getAllOrder)
  .post("/", orderController.createOrder)
  .delete("/:id", orderController.deleteOrder);

module.exports = router;
