const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  findProducts,
  findProductsByCategory,
} = require("../controllers/productController");
const { protect, adminProtect } = require("../middleware/authMiddleware"); // Middleware bảo vệ route
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Route thêm sản phẩm mới
router.post("/create", adminProtect, upload.single("img"), createProduct);
// Route cập nhật sản phẩm
router.put("/update/:id", adminProtect, upload.single("img"), updateProduct);
router.post("/create", adminProtect, createProduct);

// Route cập nhật sản phẩm
router.put("/update/:id", adminProtect, updateProduct);

// Route xóa sản phẩm
router.delete("/delete/:id", adminProtect, deleteProduct);

// Route lấy tất cả sản phẩm với phân trang
// Các tham số query: page (số trang), limit (số sản phẩm mỗi trang)
router.get("/", getAllProducts);

<<<<<<< HEAD
// Route tìm theo từ khóa tất cả sản phẩm với phân trang
// Các tham số query: page (số trang), limit (số sản phẩm mỗi trang)
router.get("/findByName", findProducts);

// Route tìm kiếm theo category và mức giá
router.get("/category", findProductsByCategory);
// Route tìm kiếm theo category và mức giá
router.get("/category", findProductsByCategory);

// Route lấy thông tin sản phẩm theo id
router.get('/:id', getProductById);

// Route tìm theo từ khóa tất cả sản phẩm với phân trang
// Các tham số query: page (số trang), limit (số sản phẩm mỗi trang)
router.get("/findByName", findProducts);



module.exports = router;
