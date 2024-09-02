const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart.js");

router
  // .get("/:id", cartController.getCartById)
  .get("/", cartController.getAllCarts)
  .get("/:userId", cartController.getCartByUserID)
  .post("/", cartController.createCart)
  .post("/increment", cartController.incrementCartItem)
  .post("/decrement", cartController.decrementCartItem)
  .put("/:id", cartController.updateCart)
  .delete("/:userId", cartController.deleteCartByUserId);

module.exports = router;
