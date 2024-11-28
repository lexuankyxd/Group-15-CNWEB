// db.js
const mongoose = require('mongoose');

// Kết nối với MongoDB
mongoose.connect('mongodb+srv://kiennguyenngoc26:o78P78ZWVZUeSygQ@webspa.3i7pu.mongodb.net/?retryWrites=true&w=majority&appName=Webspa', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('Kết nối MongoDB thành công!');
})
.catch((err) => {
  console.log('Lỗi kết nối MongoDB:', err);
});

module.exports = mongoose;
