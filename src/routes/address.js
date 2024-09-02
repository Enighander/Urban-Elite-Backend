const express = require("express");
const router = express.Router();
const addressController = require("../controller/address.js");

router
  .get("/", addressController.getAllAddress)
  .get("/:id", addressController.getAddressById)
  .get("/username/:username", addressController.getAddressByUsername)
  .post("/", addressController.createAddress)
  .put("/:id", addressController.updateAddressById)
  .put("/username/:username", addressController.updateAddressByUsername)
  .delete("/:id", addressController.deleteAddress);

module.exports = router;
