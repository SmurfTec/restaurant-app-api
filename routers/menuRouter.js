const express = require('express');

const menuController = require('../controllers/menuController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router.get('/', menuController.getAllMenus);

router.get('/:id', menuController.getMenu);

router.use(protect);

router
  .use(restrictTo('admin'))

  .route('/')
  .post(menuController.addNewMenu);

router
  .route('/:id')
  .patch(menuController.updateMenu)
  .delete(menuController.deleteMenu);

module.exports = router;
