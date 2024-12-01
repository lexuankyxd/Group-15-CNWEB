const express = require('express');
const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart
} = require('../controllers/cartController');  // Kiểm tra lại đường dẫn đúng

const router = express.Router();
const protect = require('../middleware/authMiddleware');  // Middleware bảo vệ route

// Route thêm sản phẩm vào giỏ hàng
router.post('/add', protect, addToCart);

// Route lấy giỏ hàng của người dùng
router.get('/', protect, getCart);

// Route cập nhật giỏ hàng (Cần xác thực)
router.put('/update', protect, updateCart);  // Đảm bảo rằng bạn đã có controller updateCart

// Route xóa sản phẩm khỏi giỏ hàng
router.delete('/remove', protect, removeFromCart);

module.exports = router;
