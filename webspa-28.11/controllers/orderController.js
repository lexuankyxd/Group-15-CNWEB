const Order = require("../models/orderModel");
const Cart = require("../models/cartModel"); // Lấy giỏ hàng của người dùng
const Product = require("../models/productModel"); // Lấy thông tin sản phẩm

//Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  const userId = req.user.id; // Lấy userId từ middleware xác thực
  const { shippingAddress, paymentMethod, items } = req.body; // `items` là mảng chứa các sản phẩm và số lượng

  try {
    // Nếu không có `items`, trả về lỗi
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Cần có ít nhất một sản phẩm để tạo đơn hàng." });
    }

    // Kiểm tra xem các sản phẩm có trong cơ sở dữ liệu không và tính toán giá trị
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      // Kiểm tra thông tin sản phẩm và số lượng
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Sản phẩm ${item.productId} không tồn tại.` });
      }

      // Tính toán giá trị của mỗi sản phẩm dựa trên số lượng
      const itemPrice = product.price * item.quantity;
      totalPrice += itemPrice;

      // Thêm sản phẩm vào đơn hàng
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: itemPrice,
      });
    }

    // Tạo đơn hàng mới
    const newOrder = new Order({
      userId,
      items: orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
      paymentStatus: "Chưa thanh toán", // Có thể tùy chỉnh theo nhu cầu
      status: "Chờ xử lý", // Đặt trạng thái mặc định là "Chờ xử lý"
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    await newOrder.save();

    // Nếu bạn muốn xóa giỏ hàng sau khi tạo đơn hàng, có thể xóa giỏ hàng của người dùng ở đây
    // await Cart.findOneAndDelete({ userId });

    res.status(201).json({
      message: "Đơn hàng đã được tạo thành công!",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống khi tạo đơn hàng!" });
  }
};

//Lấy danh sách đơn hàng của người dùng
exports.getOrders = async (req, res) => {
  const userId = req.user.id; // Lấy userId từ middleware xác thực

  try {
    // Lấy tất cả đơn hàng của người dùng
    const orders = await Order.find({ userId });

    if (orders.length === 0) {
      return res.status(404).json({ message: "Không có đơn hàng nào." });
    }

    res.status(200).json({
      message: "Danh sách đơn hàng",
      orders,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi hệ thống khi lấy danh sách đơn hàng!" });
  }
};

//Lấy chi tiết đơn hàng
exports.getOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id; // Lấy userId từ middleware xác thực

  try {
    // Tìm đơn hàng theo ID và người dùng
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tìm thấy." });
    }

    res.status(200).json({
      message: "Chi tiết đơn hàng",
      order,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi hệ thống khi lấy chi tiết đơn hàng!" });
  }
};

//Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body; // Trạng thái mới (Chờ xử lý, Đang giao, Hoàn thành, Đã hủy)
  const userId = req.user.id; // Lấy userId từ middleware xác thực

  try {
    // Kiểm tra trạng thái hợp lệ
    if (!["Chờ xử lý", "Đang giao", "Hoàn thành", "Đã hủy"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ." });
    }

    // Cập nhật trạng thái đơn hàng
    const order = await Order.findOneAndUpdate(
      { _id: orderId, userId },
      { status },
      { new: true }, // Trả về đơn hàng đã được cập nhật
    );

    if (!order) {
      return res
        .status(404)
        .json({ message: "Đơn hàng không tồn tại hoặc không phải của bạn." });
    }

    res.status(200).json({
      message: "Trạng thái đơn hàng đã được cập nhật!",
      order,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi hệ thống khi cập nhật trạng thái đơn hàng!" });
  }
};
// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id; // Lấy userId từ middleware xác thực

  try {
    // Xóa đơn hàng
    const order = await Order.findOneAndDelete({ _id: orderId, userId });

    if (!order) {
      return res
        .status(404)
        .json({ message: "Đơn hàng không tìm thấy hoặc không phải của bạn." });
    }

    res.status(200).json({
      message: "Đơn hàng đã được xóa!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống khi xóa đơn hàng!" });
  }
};

