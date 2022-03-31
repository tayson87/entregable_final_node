const express = require('express');
const { body } = require('express-validator');

// Controllers
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');

// Middlewares
const {
  validateSession,
  protectAdmin
} = require('../middlewares/auth.middleware');
const {
  createProductValidators,
  validateResult
} = require('../middlewares/validators.middleware');

const { productExists } = require('../middlewares/product.middleware');

const router = express.Router();

router.use(validateSession);

router
  .route('/')
  .get(getAllProducts)
  .post(
    protectAdmin,
    createProductValidators,
    validateResult,
    createProduct
  );

router
  .use('/:id', productExists)
  .route('/:id')
  .get(getProductById)
  .patch(protectAdmin, updateProduct)
  .delete(protectAdmin, deleteProduct);

module.exports = { productsRouter: router };
