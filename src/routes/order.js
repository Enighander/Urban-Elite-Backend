const express = require("express");
const router = express.Router();
const orderController = require("../controller/order");

router
  .get("/:id", orderController.getOrderById)
  .get("/username/:username", orderController.getOrderByUsername)
  .get("/UUID/:userId", orderController.getOrderByUserId)
  .post("/updatePaymentStatus", orderController.updateStatusOrderMidtrans)
  .post("/getMidtransToken", orderController.getMidtransToken)
  .get("/", orderController.getAllOrder)
  .post("/", orderController.createOrder)
  .delete("/:id", orderController.deleteOrder)
  .delete("/", orderController.deleteAllOrder);

module.exports = router;
