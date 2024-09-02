const express = require("express");
const router = express.Router();
const productRouter = require("../routes/product.js");
const categoryRouter = require("../routes/category.js");
const userRouter = require("../routes/user.js");
const addressRouter = require("../routes/address.js");
const cartRouter = require("../routes/cart.js");
const orderRouter = require("../routes/order.js");
const paymentRouter = require("../routes/payment.js");
const adminRouter = require("../routes/admin.js");
const bankRouter = require("../routes/bank.js");

router
  .use("/products", productRouter)
  .use("/banks", bankRouter)
  .use("/categories", categoryRouter)
  .use("/users", userRouter)
  .use("/admin", adminRouter)
  .use("/address", addressRouter)
  .use("/cart", cartRouter)
  .use("/payment", paymentRouter)
  .use("/order", orderRouter)

module.exports = router;
