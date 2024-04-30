const express = require("express");
const router = express.Router();
const shipmentController = require("../controller/shipment.js");

router
  .get("/", shipmentController.getAllShipment)
  .get("/:id", shipmentController.getShipmentById)
  .post("/", shipmentController.createShipment)
  .put("/:id", shipmentController.updateShipment)
  .delete("/:id", shipmentController.deleteShipment);

module.exports = router;
