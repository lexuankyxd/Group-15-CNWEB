const Product = require('../models/productModel');

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
  const { name, description, price, stock, image, category } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      image,
      category,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: 'Sản phẩm đã được thêm thành công!',
      product: savedProduct,
    });
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi hệ thống!' });
  }
};

// Lấy tất cả sản phẩm với phân trang và tìm kiếm
exports.getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Mặc định là trang 1
  const limit = parseInt(req.query.limit) || 10; // Mặc định mỗi trang sẽ hiển thị 10 sản phẩm
  const skip = (page - 1) * limit;

  // Lấy các tham số tìm kiếm từ query string
  const searchQuery = req.query.search || ''; // Tìm kiếm theo tên, mô tả, hoặc danh mục
  const categoryFilter = req.query.category || ''; // Lọc theo danh mục (nếu có)

  try {
    const totalProducts = await Product.countDocuments({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } }, // Tìm kiếm tên sản phẩm
        { description: { $regex: searchQuery, $options: 'i' } }, // Tìm kiếm mô tả sản phẩm
        { category: { $regex: categoryFilter, $options: 'i' } }, // Tìm kiếm theo danh mục
      ],
    });

    const totalPages = Math.ceil(totalProducts / limit); 

    // Lấy các sản phẩm trong trang hiện tại
    const products = await Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: categoryFilter, $options: 'i' } },
      ],
    })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: 'Danh sách sản phẩm',
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi hệ thống!' });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  const { name, description, price, stock, image, category } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock, image, category },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
    }

    res.status(200).json({
      message: 'Sản phẩm đã được cập nhật thành công!',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi hệ thống!' });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
    }

    res.status(200).json({
      message: 'Sản phẩm đã được xóa thành công!',
    });
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi hệ thống!' });
  }
};
