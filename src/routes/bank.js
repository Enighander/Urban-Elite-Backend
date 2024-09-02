const express = require("express");
const router = express.Router();
const bankController = require("../controller/bank.js");
const {
  uploadLogoBank,
  uploadToCloudinary,
} = require("../middlewares/cloudinary/uploader.jsx");

router
  .get("/", bankController.getAllOrder)
  .post("/", uploadLogoBank, uploadToCloudinary, bankController.createBanks)
  .delete("/:id", bankController.deleteBank)
  .delete("/", bankController.deleteAllBanks);

module.exports = router;
