// routes/customerRoutes.js
const express = require("express");
const {
  registerCustomer,
  loginCustomer,
  updateCustomer,
  getCustomerById,
  getAllCustomers,
} = require("../controllers/customerController"); // Import controller
const { protect, adminProtect } = require("../middleware/authMiddleware"); // Middleware bảo vệ route

const router = express.Router();

// Đăng ký khách hàng mới
router.post("/register", registerCustomer);

// Đăng nhập khách hàng
router.post("/login", loginCustomer);

// Cập nhật thông tin khách hàng
router.put("/update", protect, updateCustomer);

// Lấy thông tin khách hàng
router.get("/:id", getCustomerById);

// Lấy tất cả khách hàng trong csdl
router.get("/", getAllCustomers);
module.exports = router;
