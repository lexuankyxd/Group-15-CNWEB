// routes/customerRoutes.js
const express = require('express');
const {
  registerCustomer,
  loginCustomer,
  updateCustomer,
  getCustomerById
} = require('../controllers/customerController');  // Import controller

const router = express.Router();

// Thêm route mặc định
router.get('/', (req, res) => {
    res.send('API khách hàng đang hoạt động!');
  });
  

// Đăng ký khách hàng mới
router.post('/register', registerCustomer);

// Đăng nhập khách hàng
router.post('/login', loginCustomer);

// Cập nhật thông tin khách hàng
router.put('/update/:id', updateCustomer);

// Lấy thông tin khách hàng
router.get('/:id', getCustomerById);

module.exports = router;
