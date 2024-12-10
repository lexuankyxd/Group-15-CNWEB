// controllers/adminController.js
const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Đăng ký khách hàng mới
// controllers/adminController.js
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
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "3h" }, // Token sẽ hết hạn sau 3 giờ
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
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true },
    );
    res.status(200).json({
      message: "Cập nhật thông tin thành công!",
      customer: updatedAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

// Lấy thông tin khách hàng
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin không tồn tại!" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

exports.getAllAdmins = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Mặc định là trang 1
  const limit = parseInt(req.query.limit) || 10; // Mặc định mỗi trang sẽ hiển thị 10 sản phẩm
  const skip = (page - 1) * limit;

  try {
    const totalAdmins = await Admin.countDocuments();
    const totalPages = Math.ceil(totalAdmins / limit);

    // Lấy các sản phẩm trong trang hiện tại
    const admins = await Admin.find().skip(skip).limit(limit);

    res.status(200).json({
      message: "Danh sách admin",
      admins,
      currentPage: page,
      totalPages,
      totalAdmins,
    });
  } catch (error) {
    console.error("Lỗi khi lấy admin:", error);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};
