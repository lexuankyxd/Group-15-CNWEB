const express = require("express");
const {
  getRevenueInTimePeriod,
} = require("../controllers/reportGenController.js");
const { protect, adminProtect } = require("../middleware/authMiddleware"); // Middleware bảo vệ route

const router = express.Router();

router.get("/getRevenueInTimePeriod", adminProtect, getRevenueInTimePeriod);

module.exports = router;
