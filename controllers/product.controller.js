// Models
const { Product } = require('../models/product.model');
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { filterObj } = require('../util/filterObj');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await product.findAll({
    where: { status: 'active' },
    include: [{ model: User, attributes: { exclude: ['password'] } }]
  });

  res.status(200).json({
    status: 'success',
    data: { products }
  });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await product.findOne({
    where: {
      id
    }
  });

  if (!product) {
    return next(new AppError(404, 'Product not found !'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const { title, description, quantity, price } = req.body;
  const { id } = req.currentUser;

  const newProduct = await Product.create({
    title,
    description,
    quantity,
    price,
    userId: id
  });

  res.status(201).json({
    status: 'success',
    data: { newProduct }
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = filterObj(req.body, 'title', 'description', 'quantity', 'price');

  const product = await product.findOne({
    where: { id }
  });

  if (!product) {
    return next(new AppError(404, 'Product   not found '));
  }
  await product.update({
    ...data
  });

  res.status(204).json({
    status: 'success'
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});
