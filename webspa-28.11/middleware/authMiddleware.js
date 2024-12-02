const jwt = require("jsonwebtoken");
const User = require("../models/customerModel"); // Giả sử bạn có model Customer

const protect = async (req, res, next) => {
  let token;
  // Kiểm tra token trong Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(" ")[1];

      // Giải mã và lấy thông tin user từ token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Thêm user vào request object
      req.user = await User.findById(decoded.id).select("-password"); // Loại bỏ mật khẩu
      next(); // Cho phép tiếp tục vào route tiếp theo
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ message: "Không có quyền truy cập, token không hợp lệ" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Không có token, yêu cầu xác thực" });
  }
};

module.exports = protect;
