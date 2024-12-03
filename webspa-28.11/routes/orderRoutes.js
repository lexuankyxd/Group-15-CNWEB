const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderDetails,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');  // Middleware xác thực người dùng

const router = express.Router();

// Route tạo đơn hàng
router.post('/', protect, createOrder);

// Route lấy danh sách đơn hàng của người dùng
router.get('/', protect, getOrders);

// Route lấy chi tiết đơn hàng
router.get('/:orderId', protect, getOrderDetails);

// Route cập nhật trạng thái đơn hàng
router.put('/:orderId/status', protect, updateOrderStatus);

// Route xóa đơn hàng
router.delete('/:orderId', protect, deleteOrder);

module.exports = router;
