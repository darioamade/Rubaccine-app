const express = require('express');

const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
/* 
router.use(authController.protect);

router
  .route('/cart')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setMenUserIds,
    reviewController.creatReview
  );

router
  .route('/:id')
  .get(reviewController.getOneReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );
// //NOTE first protect  the route for only users log in, then restriste to users with role of 'USER'
// router.route('/:id').get(reviewController.getOneReview); */

module.exports = router;
