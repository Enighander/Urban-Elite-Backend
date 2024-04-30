const express = require("express");
const router = express.Router();
const addressController = require("../controller/address.js");

router
  .get("/:username", addressController.getAddressByUsername)
  .get("/", addressController.getAllAddress)
  .post("/", addressController.createAddress)
  .put("/:username", addressController.updateAddressByUsername)
  .delete("/:id", addressController.deleteAddress);

module.exports = router;
