const Product = require("../models/productModel");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const S3_BUCKET = process.env.S3_BUCKET;
const AWS_REGION = process.env.AWS_REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const CLOUDFRONT_DIST = process.env.CLOUDFRONT_DIST;
const s3 = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: AWS_REGION,
});
// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  var image = Date.now() + "_" + req.file.originalname;
  try {
    const params = {
      Bucket: S3_BUCKET,
      Key: image,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);
    image = CLOUDFRONT_DIST + image;
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
      message: "Sản phẩm đã được thêm thành công!",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  const { name, description, price, stock, image, category } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock, image, category },
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }

    res.status(200).json({
      message: "Sản phẩm đã được cập nhật thành công!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }

    res.status(200).json({
      message: "Sản phẩm đã được xóa thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

//customer apis

// Lấy tất cả sản phẩm với phân trang
exports.getAllProducts = async (req, res) => {
<<<<<<< HEAD
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    // Lấy các sản phẩm trong trang hiện tại
    const products = await Product.find().skip(skip).limit(limit);

    res.status(200).json({
      message: "Danh sách sản phẩm",
      products,
      currentPage: page,
      totalPages,
      totalProducts,
=======
  try {
    // Check if pagination parameters exist
    if (req.query.page || req.query.limit) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalProducts = await Product.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);
      const products = await Product.find().skip(skip).limit(limit);

      return res.status(200).json({
        message: "Danh sách sản phẩm",
        products,
        currentPage: page,
        totalPages,
        totalProducts,
      });
    }

    // Return all products if no pagination parameters
    const products = await Product.find();
    return res.status(200).json({
      message: "Danh sách sản phẩm",
      products,
    });

  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }

    res.status(200).json({
      message: "Sản phẩm đã được tìm thấy!",
      product: product,
>>>>>>> ef73f166be951ef9cc4e6eea354032486c5e2246
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

// Tìm sản phẩm theo từ khóa trong tên
exports.findProducts = async (req, res) => {
<<<<<<< HEAD
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
=======
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 
>>>>>>> ef73f166be951ef9cc4e6eea354032486c5e2246
  const skip = (page - 1) * limit;
  const keywords = req.body.keywords.split(" ");
  const regexPattern = `\\b(?:${keywords.join("|")})\\b`;
  const regex = new RegExp(regexPattern, "i");
  try {
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find({
      name: { $regex: keywords.join("|"), $options: "i" },
    })
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      message: "Danh sách sản phẩm",
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

// Tìm sản phẩm theo category và mức giá
exports.findProductsByCategory = async (req, res) => {
<<<<<<< HEAD
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const category = req.query.category;
  const priceRange = req.query.priceRange;
=======
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 
  const skip = (page - 1) * limit;

  const category = req.query.category; 
  const priceRange = req.query.priceRange; 
>>>>>>> ef73f166be951ef9cc4e6eea354032486c5e2246

  if (!category) {
    return res.status(400).json({ message: "Category is required!" });
  }

  let priceFilter = {};

  // Xử lý lọc theo mức giá
  if (priceRange) {
    switch (priceRange) {
      case "under1m":
        priceFilter = { price: { $lt: 1000000 } };
        break;
      case "1mTo3m":
<<<<<<< HEAD
        priceFilter = { price: { $gte: 1000000, $lt: 3000000 } };
        break;
      case "3mTo10m":
        priceFilter = { price: { $gte: 3000000, $lt: 10000000 } };
      case "10mTo20m":
        priceFilter = { price: { $gte: 10000000, $lt: 20000000 } };
        break;
      case "above20m":
        priceFilter = { price: { $gte: 20000000 } };
        break;
      default:
        priceFilter = {};
=======
        priceFilter = { price: { $gte: 1000000, $lt: 3000000 } }; 
        break;
      case "3mTo10m":
        priceFilter = { price: { $gte: 3000000, $lt: 10000000 } }; 
        break;
      case "10mTo20m":
        priceFilter = { price: { $gte: 10000000, $lt: 20000000 } }; 
        break;
      case "above20m":
        priceFilter = { price: { $gte: 20000000 } }; 
        break;
      default:
        priceFilter = {}; 
>>>>>>> ef73f166be951ef9cc4e6eea354032486c5e2246
    }
  }

  try {
    // Tính tổng số sản phẩm thỏa mãn các điều kiện
    const totalProducts = await Product.countDocuments({
      category: category,
      ...priceFilter,
    });

    // Nếu không có sản phẩm thỏa mãn, trả về thông báo
    if (totalProducts === 0) {
      return res.status(200).json({
        message: "Không có sản phẩm thỏa mãn yêu cầu tìm kiếm.",
        products: [],
        currentPage: page,
        totalPages: 0,
        totalProducts: 0,
      });
    }

    const totalPages = Math.ceil(totalProducts / limit);

    // Lấy các sản phẩm trong category và mức giá tương ứng
    const products = await Product.find({
      category: category,
      ...priceFilter,
    })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Danh sách sản phẩm theo category và mức giá",
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo category và mức giá:", error);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};
