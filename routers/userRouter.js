const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router
  .route('/')
  .get(protect, userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/me')
  .get(protect, userController.getMe, userController.getUser)
  .patch(protect, userController.getMe, userController.updateUser);

router.patch('/updatePassword', authController.updatePassword);

router
  .route('/:id')
  .get(protect, userController.getUser)
  .patch(protect, userController.updateUser)
  .delete(protect, restrictTo('admin'), userController.deleteUser);

module.exports = router;
