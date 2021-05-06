/* eslint-disable import/no-useless-path-segments */
const express = require('express');
const girlsController = require('./../controllers/girlsController');
const authController = require('./../controllers/authController');

const router = express.Router();

// params router // val = value
// router.param('id', girlsController.checkID);

router
  .route('/best-sellers')
  .get(girlsController.aliasBestSeller, girlsController.getAllProducts);

router.route('/girls-stats').get(girlsController.getGirlsStats);

router
  .route('/')
  .get(girlsController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'assist'),
    girlsController.creatProduct
  );
router
  .route('/:id')
  .get(girlsController.getOneProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'assist'),
    girlsController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'assist'),
    girlsController.deleteProduct
  );

module.exports = router;
