const express = require("express");
const router = express.Router();
const shipmentController = require("../controller/shipment.js");

router
  .get("/", shipmentController.getAllShipment)
  .get("/:id", shipmentController.getShipmentById)
  .post("/", shipmentController.createShipment)
  .put("/:id/paid", shipmentController.updateShipmentAsPaid)
  .put("/:id/delivery", shipmentController.updateShipmentAsProgressDelivery)
  .put("/:id/arrived", shipmentController.updateShipmentAsArrived)
  .delete("/:id", shipmentController.deleteShipment)
  .delete("/", shipmentController.deleteAllShipment)

module.exports = router;
