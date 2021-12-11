const Menu = require('../models/menuModel');
const Restaurant = require('../models/restaurantModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.find();

  res.status(200).json({
    status: 'success',
    restaurants,
  });
});

exports.addNewRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.create(req.body);

  res.status(201).json({
    status: 'success',
    restaurant,
  });
});

exports.getRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant)
    return next(
      new AppError(`Can't find restaurant for id ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    restaurant,
  });
});

exports.updateRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!restaurant)
    return next(
      new AppError(`Can't find restaurant for id ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    restaurant,
  });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

  if (!restaurant)
    return next(
      new AppError(`Can't find restaurant for id ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    restaurant,
  });
});

exports.addMenuToRestaurant = catchAsync(async (req, res, next) => {
  const { restaurantId, menuId } = req.params;
  const { name } = req.body;

  if (!name) return next(new AppError(`Please provide meal name with request`));

  // * find Menu
  const menu = await Menu.findById(menuId);
  if (!menu) return next(new AppError(`No Menu found against id ${menuId}`));

  // * find Restaurant
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant)
    return next(new AppError(`No Restaurant found against id ${restaurantId}`));

  let meal = restaurant.meals.find((el) => el.name === name);

  if (meal) {
    (meal.menu = menuId),
      restaurant.meals.map((el) => (el._id === meal._id ? meal : el));
  } else
    restaurant.meals.push({
      name,
      menu: menuId,
    });

  await restaurant.save();
  await Restaurant.populate(restaurant, {
    path: 'meals.menu',
  });

  res.status(200).json({
    status: 'success',
    meals: restaurant.meals.length,
    restaurant,
    menu,
  });
});
