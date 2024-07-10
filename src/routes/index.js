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

router
  .use("/products", productRouter)
  .use("/categories", categoryRouter)
  .use("/users", userRouter)
  .use("/admin", adminRouter)
  .use("/address", addressRouter)
  .use("/cart", cartRouter)
  .use("/order", orderRouter)
  .use("/payment", paymentRouter);

module.exports = router;
