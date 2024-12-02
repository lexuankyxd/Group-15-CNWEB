const express = require("express");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  findProducts,
} = require("../controllers/productController");

const router = express.Router();

// Route thêm sản phẩm mới
router.post("/create", createProduct);

// Route cập nhật sản phẩm
router.put("/update/:id", updateProduct);

// Route xóa sản phẩm
router.delete("/delete/:id", deleteProduct);

// Route lấy tất cả sản phẩm với phân trang
// Các tham số query: page (số trang), limit (số sản phẩm mỗi trang)
router.get("/", getAllProducts);

// Route tìm theo từ khóa tất cả sản phẩm với phân trang
// Các tham số query: page (số trang), limit (số sản phẩm mỗi trang)
router.get("/findByName", findProducts);
module.exports = router;
