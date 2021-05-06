const express = require('express');

const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

// using the protect middleware complete autoside
router.use(authController.protect);
// menID will be so much easer if i implement one single collection with both men and women
router.get(
  '/checkout-session/:menId',
  authController.protect,
  bookingController.getCheckoutSession
);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
