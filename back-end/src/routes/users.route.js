const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateOtpVerify,
  updateOtpVerifyById,
  updateOtpVerifyByEmail,
} = require("../controllers/users.controller");

router.route("/").get(getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
router.route("/:id/otp-verify-id").put(updateOtpVerifyById);
router.route("/:email/otp-verify-email").put(updateOtpVerifyByEmail);

module.exports = router;
