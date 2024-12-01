// controllers/customerController.js
const Customer = require("../models/Customer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Đăng ký khách hàng mới
// controllers/customerController.js
exports.registerCustomer = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // Kiểm tra dữ liệu
  console.log("Dữ liệu nhận được từ frontend:", req.body);

  // Kiểm tra xem khách hàng đã tồn tại chưa
  try {
    const customerExists = await Customer.findOne({ email });
    if (customerExists) {
      console.log("Email đã tồn tại:", email);
      return res.status(400).json({ message: "Email đã được đăng ký!" });
    }

    // Tạo khách hàng mới
    const customer = new Customer({
      name,
      email,
      password,
      phone,
      address,
    });

    const savedCustomer = await customer.save();
    res.status(201).json({
      message: "Đăng ký thành công!",
      customer: savedCustomer,
    });
  } catch (error) {
    console.error("Lỗi trong quá trình đăng ký:", error.message); // Log lỗi chi tiết
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

// Đăng nhập khách hàng
exports.loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  const customer = await Customer.findOne({ email });
  if (!customer) {
    return res.status(400).json({ message: "Email không tồn tại!" });
  }

  const isMatch = await customer.matchPassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Mật khẩu không chính xác!" });
  }

  const token = jwt.sign(
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
exports.updateCustomer = async (req, res) => {
  const { name, phone, address } = req.body;
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
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
