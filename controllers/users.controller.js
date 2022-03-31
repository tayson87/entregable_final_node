const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');
const { Order } = require('../models/order.model');

// Utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { filterObj } = require('../util/filterObj');


dotenv.config({ path: './config.env' });

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user given an email and has status active
  const user = await User.findOne({
    where: { email, status: 'active' }
  });

  // Compare entered password vs hashed password
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError(400, 'Credentials are invalid'));
  }

  // Create JWT
  const token = await jwt.sign(
    { id: user.id }, // Token payload
    process.env.JWT_SECRET, // Secret key
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  res.status(200).json({
    status: 'success',
    data: { token }
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes:
         { exclude: ['password'] },
    where:
           { status: 'active' }
  });

  res.status(200).json({
     status: 'success', 
     data: { users }
     });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
 
  const user = await  user.findOne({ 
        where: {
           id
       }
   });

   if(!user) {     
            return next(new AppError(404, 'user not found !'));         
   }

   res.status (200).json({
       status: 'success',
       data: {
           user,
       },
   });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword
  });

  newUser.password = undefined;  

  res.status(201).json({
    status: 'success',
    data: { newUser }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = filterObj(req.body, 'username', 'email' );

 const user = await user.findOne({
      where: { id }
  });   
     
  if(!user) {
     return next(new AppError(404, 'user   not found '));
  }        
  await user.update(
      { 
          ...data
      });      

  res.status(204).json({
      status: 'success'
  });       
});;

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});

 exports.getAllOrders = catchAsync(async(req, res, next) => {
  const orders  = await Order.findAll({
    where:
           { status: 'active' }
  });

  res.status(200).json({
     status: 'success', 
     data: { orders }
     });
});

exports.getOrderById = catchAsync(async(req,res, netx) => {
  const { id } = req.params;
 
  const order = await  order.findOne({ 
        where: {
           id
       }
   });

   if(!order) {     
            return next(new AppError(404, 'order not found !'));         
   }

   res.status (200).json({
       status: 'success',
       data: {
           order,
       },
   });
});

 