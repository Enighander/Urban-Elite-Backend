const express = require("express");
const router = express.Router();
const cardController = require("../controller/card.js");

router
  .get("/", cardController.getAllCreditCard)
  .get("/:id", cardController.getCreditCardById)
  .get("/UUID/:userId", cardController.getCreditCardByUserID)
  .post("/", cardController.createCreditCard)
  .put("/:id", cardController.updateCreditCard)
  .delete("/", cardController.deleteAllCreditCard)
  .delete("/:id", cardController.deleteCreditCard);

module.exports = router;
