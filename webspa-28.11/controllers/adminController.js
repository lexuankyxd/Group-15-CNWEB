// controllers/adminController.js
const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Đăng ký khách hàng mới
// controllers/customerController.js
exports.registerAdmin = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Kiểm tra dữ liệu
  console.log("Dữ liệu nhận được từ frontend:", req.body);

  // Kiểm tra xem khách hàng đã tồn tại chưa
  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      console.log("Email đã tồn tại:", email);
      return res.status(400).json({ message: "Email đã được đăng ký!" });
    }

    // Tạo khách hàng mới
    const admin = new Admin({
      name,
      email,
      password,
      phone,
    });

    const savedAdmin = await admin.save();
    res.status(201).json({
      message: "Đăng ký thành công!",
      admin: savedAdmin,
    });
  } catch (error) {
    console.error("Lỗi trong quá trình đăng ký:", error.message); // Log lỗi chi tiết
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

// Đăng nhập khách hàng
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(400).json({ message: "Email không tồn tại!" });
  }

  const isMatch = await admin.matchPassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Mật khẩu không chính xác!" });
  }

  const token = jwt.sign(
    { role: "admin" },
    { id: customer._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }, // Token sẽ hết hạn sau 1 giờ
  );
  res.status(200).json({
    message: "Đăng nhập thành công!",
    token,
  });
};

// Cập nhật thông tin khách hàng
exports.updateAdmin = async (req, res) => {
  const { name, phone } = req.body;
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.user.id,
      { name, phone, address },
      { new: true },
    );
    res.status(200).json({
      message: "Cập nhật thông tin thành công!",
      customer: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

// Lấy thông tin khách hàng
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Khách hàng không tồn tại!" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};
