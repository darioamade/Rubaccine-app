/* eslint-disable import/no-useless-path-segments */
const express = require('express');
const menController = require('./../controllers/menController');
const authController = require('./../controllers/authController');
//const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRouter');

const router = express.Router();

router.use('/:menId/reviews', reviewRouter);

router
  .route('/best-sellers')
  .get(menController.aliasBestSeller, menController.getAllProducts);

router.route('/men-stats').get(menController.getMenStats);
router
  .route('/')
  .get(menController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'assist'),
    menController.creatProduct
  );

//NOTE this will be Get house within distance
router
  .route('/men-within/:distance/center/:latlng/unit/:unit')
  .get(menController.getMenWithin);

// men-within=233&center=-40,45&unit=km
// men-within/233/center/-40,45/unit/km
router.route('/distances/:latlng/unit/:unit').get(menController.getDistances);

router
  .route('/:id')
  .get(menController.getOneProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'assist'),
    menController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'assist'),
    menController.uploadMenImages,
    menController.resizeMenImages,
    menController.deleteProduct
  );

module.exports = router; // export only one thing

// EXAMPLES
// params router // val = value
// router.param('id', menController.checkID);

//POST /men/2323546576/reviews   <--NESTED ROUTE
//GEt /men/2323546576/reviews
//GEt /men/2323546576/reviews/6723467t8349   <--NESTED ROUTE
// NOTE NESTED
/* router
  .route('/:menId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.creatReview
  );  FIX this duplicate code using merge params */
