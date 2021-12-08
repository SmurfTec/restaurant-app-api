const Menu = require('../models/menuModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllMenus = catchAsync(async (req, res, next) => {
  const menus = await Menu.find();

  res.status(200).json({
    status: 'success',
    menus,
  });
});

exports.addNewMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.create(req.body);

  res.status(201).json({
    status: 'success',
    menu,
  });
});

exports.getMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.findById(req.params.id);

  if (!menu)
    return next(new AppError(`Can't find menu for id ${req.params.id}`, 404));

  res.status(200).json({
    status: 'success',
    menu,
  });
});

exports.updateMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!menu)
    return next(new AppError(`Can't find menu for id ${req.params.id}`, 404));

  res.status(200).json({
    status: 'success',
    menu,
  });
});

exports.deleteMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.findByIdAndDelete(req.params.id);

  if (!menu)
    return next(new AppError(`Can't find menu for id ${req.params.id}`, 404));

  res.status(200).json({
    status: 'success',
    menu,
  });
});
