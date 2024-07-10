const express = require("express");
const router = express.Router();
const userController = require("../controller/user.js");

router
  .put("/forgot-password", userController.forgotPasswordSendingByEmail)
  .get("/:id", userController.getUserById)
  .get("/", userController.getAllUser)
  .get("/username/:username", userController.getUser)
  .put("/:id/updateUser", userController.updateUser)
  .put("/:id/updatePassword", userController.updatePassword)
  .post("/register", userController.registerUser)
  .post("/login", userController.loginUser)
  .delete("/:id", userController.deleteUser);

module.exports = router;
