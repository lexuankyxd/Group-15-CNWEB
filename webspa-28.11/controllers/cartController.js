const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // Lấy userId từ middleware xác thực

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }

<<<<<<< HEAD
    const cart = await Cart.findOne({ userId: userId });
=======
    let cart = await Cart.findOne({ userId: userId });
>>>>>>> ef73f166be951ef9cc4e6eea354032486c5e2246
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, price: product.price * quantity }],
        totalPrice: product.price * quantity,
      });
<<<<<<< HEAD
      await newCart.save();
      return res.status(201).json({
        message: "Sản phẩm đã được thêm vào giỏ hàng!",
        cart: newCart,
      });
    }

    // Nếu giỏ hàng đã tồn tại, kiểm tra xem sản phẩm đã có trong giỏ chưa
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (itemIndex !== -1) {
      // Cập nhật số lượng sản phẩm trong giỏ
      cart.items[itemIndex].quantity =
        parseInt(cart.items[itemIndex].quantity) + parseInt(quantity);
      cart.items[itemIndex].price =
        product.price * cart.items[itemIndex].quantity;
=======
>>>>>>> ef73f166be951ef9cc4e6eea354032486c5e2246
    } else {
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += parseInt(quantity);
        cart.items[existingItemIndex].price = product.price * cart.items[existingItemIndex].quantity;
      } else {
        cart.items.push({
          productId,
          quantity,
          price: product.price * quantity,
        });
      }
      cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
    }

    await cart.save();
    
    // Populate and format the response
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    const formattedItems = populatedCart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: product.price,
      name: item.productId.name,
      category: item.productId.category,
      image: item.productId.image,
    }));

    res.status(200).json({
      message: "Giỏ hàng đã được cập nhật!",
      items: formattedItems,
      totalPrice: populatedCart.totalPrice
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi hệ thống khi thêm sản phẩm vào giỏ hàng!" });
  }
};

// Lấy giỏ hàng của người dùng
exports.getCart = async (req, res) => {
  const userId = req.user.id; // Lấy userId từ middleware xác thực

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại!" });
    }
    res.status(200).json({ cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống khi lấy giỏ hàng!" });
  }
};

// Xóa giỏ hàng
exports.removeCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const deleteCart = await Cart.deleteOne({ userId: userId });
    if (!deleteCart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại!" });
    }

<<<<<<< HEAD
    res.status(200).json({ message: "Giỏ hàng đã được xóa!" });
=======
    res.status(200).json({
      message: "Giỏ hàng đã được xóa!",
      items: [],
      totalPrice: 0
    });
>>>>>>> ef73f166be951ef9cc4e6eea354032486c5e2246
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi hệ thống khi xóa giỏ hàng" });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại!" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (itemIndex === -1) {
<<<<<<< HEAD
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong giỏ hàng!" });
    }
    if (cart.items.length == 1) exports.removeCart(req, res);
    cart.items.splice(itemIndex, 1);

    // Cập nhật tổng giá trị giỏ hàng
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
    await cart.save();
    res
      .status(200)
      .json({ message: "Sản phẩm đã được xóa khỏi giỏ hàng!", cart });
=======
      return res.status(404).json({ message: "Sản phẩm không có trong giỏ hàng!" });
    }

    // Remove the item
    cart.items.splice(itemIndex, 1);

    // If cart is now empty, delete it
    if (cart.items.length === 0) {
      await Cart.deleteOne({ userId });
      return res.status(200).json({
        message: "Giỏ hàng đã được xóa!",
        items: [],
        totalPrice: 0
      });
    }

    // Otherwise update the cart
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    const formattedItems = populatedCart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
      name: item.productId.name,
      category: item.productId.category,
      image: item.productId.image
    }));

    res.status(200).json({
      message: "Sản phẩm đã được xóa khỏi giỏ hàng!",
      items: formattedItems,
      totalPrice: cart.totalPrice
    });
>>>>>>> ef73f166be951ef9cc4e6eea354032486c5e2246
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi hệ thống khi xóa sản phẩm khỏi giỏ hàng!" });
  }
};

// Cập nhật giỏ hàng (thêm, giảm số lượng)
exports.updateCartItemQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // Lấy userId từ middleware xác thực

  try {
    // Kiểm tra xem quantity có phải là một số hợp lệ không
    if (isNaN(quantity) || quantity < 0) {
      return res
        .status(400)
        .json({ message: "Số lượng sản phẩm không hợp lệ!" });
    } else if (quantity == 0) {
      return exports.removeFromCart(req, res);
    }

    // Lấy giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại!" });
    }

    // Tìm sản phẩm trong giỏ hàng
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong giỏ hàng!" });
    }

    // Lấy thông tin sản phẩm từ database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }

    // Tính toán lại giá của sản phẩm trong giỏ hàng
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price * quantity; // Đảm bảo giá trị price hợp lệ

    // Cập nhật tổng giá trị giỏ hàng
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);

    // Lưu lại giỏ hàng đã cập nhật
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    const formattedItems = populatedCart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
      name: item.productId.name,
      category: item.productId.category,
      image: item.productId.image
    }));

    res.status(200).json({
      message: "Giỏ hàng đã được cập nhật!",
      items: formattedItems,
      totalPrice: populatedCart.totalPrice
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống khi cập nhật giỏ hàng!" });
  }
};
