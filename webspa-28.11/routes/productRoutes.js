const express = require('express');
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

// Route thêm sản phẩm mới
router.post('/create', createProduct);

// Route lấy tất cả sản phẩm với phân trang và tìm kiếm
// Các tham số query: page (số trang), limit (số sản phẩm mỗi trang), search (tìm kiếm), category (lọc theo danh mục)
router.get('/', getAllProducts);

// Route cập nhật sản phẩm
router.put('/update/:id', updateProduct);

// Route xóa sản phẩm
router.delete('/delete/:id', deleteProduct);

module.exports = router;
