const express = require("express");
const router = express.Router();
const productRouter = require("../routes/product.js");
const categoryRouter = require("../routes/category.js");
const userRouter = require("../routes/user.js");
const addressRouter = require("../routes/address.js");
const cartRouter = require("../routes/cart.js");
const shipmentRouter = require("../routes/shipment.js");
const paymentRouter = require("../routes/payment.js")

router
  .use("/products", productRouter)
  .use("/categories", categoryRouter)
  .use("/users", userRouter)
  .use("/address", addressRouter)
  .use("/cart", cartRouter)
  .use("/shipment", shipmentRouter)
  .use("/payment", paymentRouter)

module.exports = router;
