const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    // payload + secret + expire time
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createsendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // Remove the password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  let user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createsendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);

  if (!email || !password) {
    //  check email and password exist
    return next(new AppError(' please proveide email and password ', 400));
  }

  const user = await User.findOne({ email }).select('+password'); // select expiclity password

  if (!user)
    return next(new AppError(`No User found against email ${email}`, 404));
  if (
    !user || // check user exist and password correct
    !(await user.correctPassword(password, user.password))
  ) {
    // candinate password,correctpassword
    return next(new AppError('incorrect email or password', 401));
  }

  console.log(`user`, user);

  // if eveything is ok
  createsendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) get user from collection
  const user = await User.findById(req.user.id).select('+password');
  console.log(user);

  // 2) check if posted current Password is Correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    // currentpass,db pass
    return next(new AppError(' Your current password is wrong', 401));
  }

  // 3) if so update the  password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  // 4) Log user in , send JWT
  createsendToken(user, 200, res);
});
