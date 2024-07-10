const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin.js");

router
  .get("/", adminController.getAllAdmin)
  .get("/:id", adminController.getAdmin)
  .put("/:id/updatePassword", adminController.updateAdminPassword)
  .post("/register", adminController.registerAdmin)
  .post("/login", adminController.loginAdmin)
  .delete("/:id", adminController.deleteAdmin);

module.exports = router;
