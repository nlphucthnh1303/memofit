const express = require("express");
const router = express.Router();

const {
  register,
  login,
  sendRegisterAuthOTP,
  sendForgotAuthOTP,
  verifyOtp,
  resetPassword,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/send-register-otp", sendRegisterAuthOTP);
router.post("/send-forgot-otp", sendForgotAuthOTP);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
