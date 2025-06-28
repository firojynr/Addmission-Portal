const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
router.get("/", authController.homePage);
router.get("/register", authController.registerPage);
router.post("/register", authController.addUser);
router.get("/login", authController.loginPage);
router.post("/login", authController.authUser);
router.post("/sendOtp", authController.sendOtp);
router.get(
  "/application",
  authController.verifyToken,
  authController.applicationPage
);
module.exports = router;
