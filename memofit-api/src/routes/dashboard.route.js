const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const authcheck = require("../middleware/authcheck");

router.get("/overview", authcheck, dashboardController.getDashboardOverview);

module.exports = router;
