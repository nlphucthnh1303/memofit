const express = require("express");
const router = express.Router();
const authcheck = require("../middleware/authcheck");
const { getDueReviews } = require("../controllers/notifications.controller");

router.get("/due-reviews", authcheck, getDueReviews);

module.exports = router;
