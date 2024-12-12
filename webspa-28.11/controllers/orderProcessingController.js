const Order = require("../models/orderModel.js");

//Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body; // Trạng thái mới (Chờ xử lý, Đang giao, Hoàn thành, Đã hủy)

  try {
    // Kiểm tra trạng thái hợp lệ
    if (
      ![
        "Chờ thanh toán",
        "Chờ xử lý",
        "Đang giao",
        "Hoàn thành",
        "Đã hủy",
      ].includes(status)
    ) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ." });
    }

    // Cập nhật trạng thái đơn hàng
    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      { status },
      { new: true }, // Trả về đơn hàng đã được cập nhật
    );

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại." });
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

exports.refundOrder = (orderId) => {
  console.log("refunded order: " + orderId);
};
