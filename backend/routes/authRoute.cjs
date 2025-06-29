const express = require("express");
const {
  loginController,
  registerController,
} = require("../controllers/authController.cjs");

const authRouter = express.Router();

authRouter.post("/admin-login", loginController);
authRouter.post("/register", registerController);

module.exports = authRouter;
