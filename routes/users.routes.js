const express = require('express');

// Controllers
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getAllOrders,
  getOrderById
} = require('../controllers/users.controller');

// Middlewares
const { validateSession } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', createUser);

router.post('/login', loginUser);

router.use(validateSession);

router.get('/', getAllUsers);

router.get('/', getAllOrders); 

router.route('/:id')
.get(getUserById)
.patch(updateUser)
.delete(deleteUser)
.get(getOrderById);

module.exports = { usersRouter: router };
