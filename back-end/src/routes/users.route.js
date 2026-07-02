const express = require("express");
const router = express.Router();
const authcheck = require("../middleware/authcheck");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateOtpVerify,
  updateOtpVerifyById,
  updateOtpVerifyByEmail,
  resetUserData,
} = require("../controllers/users.controller");

router.route("/").get(getUsers).post(createUser);
router.post("/reset-data", authcheck, resetUserData);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
router.route("/:id/otp-verify-id").put(updateOtpVerifyById);
router.route("/:email/otp-verify-email").put(updateOtpVerifyByEmail);

module.exports = router;
