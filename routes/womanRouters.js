/* eslint-disable import/no-useless-path-segments */
const express = require('express');
const womanController = require('./../controllers/womanController');
const authController = require('./../controllers/authController');

const router = express.Router();

// params router // val = value
// router.param('id', womanController.checkID);


router
  .route('/best-sellers')
  .get(womanController.aliasBestSeller, womanController.getAllProducts);

router.route('/women-stats').get(womanController.getWomenStats);

router
  .route('/')
  .get(womanController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'assist'),
    womanController.creatProduct
  );
router
  .route('/:id')
  .get(womanController.getOneProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'assist'),
    womanController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'assist'),
    womanController.deleteProduct
  );

module.exports = router;
