const express = require('express');

const checkoutController = require('../controllers/checkoutController');

const router = express.Router();

router
  .route('/')
  .get(checkoutController.getAllCheckouts)
  .post(checkoutController.createCheckout);

router.route('/details//?#!/login/').get(checkoutController.getCheckout);
router.route('/details').get(checkoutController.getCheckout);
router.route('/delivery').get(checkoutController.getCheckout);
router.route('/review').get(checkoutController.getCheckout);
router.route('/payment').get(checkoutController.getCheckout);

// router
//   .route('/')
//   .get(checkoutController.getCheckout)
//   .patch(checkoutController.updateCheckout)
//   .delete(checkoutController.deleteCheckout);

module.exports = router;
