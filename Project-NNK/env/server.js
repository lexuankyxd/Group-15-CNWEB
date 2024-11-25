require('dotenv').config(); 
const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const bodyParser = require('body-parser'); 

// Khởi tạo ứng dụng Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import Routes
const customerRoutes = require('../routes/customerRoutes'); 
const cartRoutes = require('../routes/cartRoutes');
const orderRoutes = require('../routes/orderRoutes');

// Sử dụng Routes
app.use('/api/customers', customerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Kết nối MongoDB
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    // Chạy server sau khi kết nối MongoDB thành công
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
