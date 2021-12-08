const express = require('express');

const restaurantController = require('../controllers/restaurantController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router.get('/', restaurantController.getAllRestaurants);

router
  .route('/')
  .post(protect, restrictTo('admin'), restaurantController.addNewRestaurant);

router
  .route('/:id')
  .get(restaurantController.getRestaurant)
  .patch(protect, restrictTo('admin'), restaurantController.updateRestaurant)
  .delete(protect, restrictTo('admin'), restaurantController.deleteRestaurant);

router.patch(
  '/:restaurantId/menus/:menuId',
  restaurantController.addMenuToRestaurant
);

module.exports = router;
