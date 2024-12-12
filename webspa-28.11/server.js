require("dotenv").config();
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require("./db");
const customerRoutes = require("./routes/customerRoutes");
const adminRoutes = require("./routes/adminRoutes.js");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderProcessingRoutes = require("./routes/orderProcessingRoutes.js");
<<<<<<< HEAD
const reportGenRoutes = require("./routes/reportGenRoutes.js");
=======
>>>>>>> ef73f166be951ef9cc4e6eea354032486c5e2246

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
const port = process.env.PORT || 5000;
// Middleware
app.use(bodyParser.json());

// Sử dụng các route cho khách hàng
app.use("/api/customers", customerRoutes);

// Sử dụng các route cho admin
app.use("/api/admins", adminRoutes);

// Sử dụng các route cho sản phẩm
app.use("/api/products", productRoutes);

// Đăng ký route giỏ hàng
app.use("/api/cart", cartRoutes);

// Tạo đơn hàng
app.use("/api/orders", orderRoutes);

// Xử lý đơn hàng
app.use("/api/orderProcessing", orderProcessingRoutes);

<<<<<<< HEAD
app.use("/api/reportGen", reportGenRoutes);
=======
>>>>>>> ef73f166be951ef9cc4e6eea354032486c5e2246
// Chạy server
app.listen(port, () => {
  console.log(`Server đang chạy trên cổng ${port}`);
});
