require('dotenv').config();  
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db');
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes'); 
const cartRoutes = require('./routes/cartRoutes'); 

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Sử dụng các route cho khách hàng
app.use('/api/customers', customerRoutes);

// Sử dụng các route cho sản phẩm
app.use('/api/products', productRoutes); 

// Đăng ký route giỏ hàng
app.use('/api/cart', cartRoutes);

// Chạy server
app.listen(port, () => {
  console.log(`Server đang chạy trên cổng ${port}`);
});
