const express = require('express');
const viewsController = require('../controllers/viewsController');
const authcontroller = require('../controllers/authController');
const bookingcontroller = require('../controllers/bookingController');

const router = express.Router();

router.use(authcontroller.isLoggedIn); // NOTE not needed for now
router.get('/add-to-cart2/:id', viewsController.addToCart2);
router.get('/add-to-cart/:id', viewsController.addToCart);

router.get('/men', viewsController.getMen);
router.get('/men/t-shirt', viewsController.getTShirt);

router.get('/men/watch', viewsController.getWatch);
router.get('/men/shirt', viewsController.getShirt);
router.get('/men/jacket', viewsController.getJacket);
router.get('/men/jeans', viewsController.getJeans);
router.get('/men/best-seller', viewsController.getBest);
router.get('/men/tailoring', viewsController.getTailoring);
router.get('/men/boots&shoes', viewsController.getBoots);
router.get('/men/outlet', viewsController.getOutlet);
// router.get('/shopping-cart', viewsController.getShoppingCart);

router.get('/women/dresses', viewsController.getDresses);
router.get('/women/jacket', viewsController.getGirlsJacket);
router.get('/women/t-shirt', viewsController.getGirlsTShirt);
router.get('/women/knitwear', viewsController.getKnitwear);
router.get('/women/accessories', viewsController.getHandbags);
router.get('/women/all-shoes', viewsController.getGirlsBoots);
router.get('/women/best-seller', viewsController.getGirlsBestSeller);
router.get('/women/outlet', viewsController.getGirlsOutlet);
// router.get('/women/outlet', viewsController.getGirlsOutlet);

router.get('/store-reopening-safety', viewsController.getReopen);
router.get('/store-locator', viewsController.getStoreLocator);

// NOTE this route is suppose to be account details
router.get(
  '/account/orders/',
  authcontroller.protect,
  viewsController.getMyOrders
); // my tours
router.get('/basket', viewsController.getBasketBeforeLogin);
/* 
router.get('/cart', viewsController.getCart);
router.get('/detete-cart', viewsController.getDeleteCart);
router
  .post('/update-cart', viewsController.getUpdateOne)
  .patch(authcontroller.restrictTo('user'));
 */
router.get('/collections', viewsController.getCollections);
router.get(
  '/',
  bookingcontroller.createBookingCheckout,
  viewsController.getWomen
); // Here is the route of the website '/wome',

router.get('/women', viewsController.getWomen);
router.get('/women-1/new', viewsController.getWomenNew);
router.get('/women-1/:slug', viewsController.getDescriptionWomen);
// router.get('/women', authcontroller.protect, viewsController.getWomen);
router.get('/account', viewsController.getAccount); // Leave not protect for none register guess
router.get(
  '/account/details/',
  authcontroller.protect,
  viewsController.getDetails
);

router.post('/charge', authcontroller.protect, viewsController.getCharge);
router.get('/success', authcontroller.protect, viewsController.getSuccess);
router.get('/checkout', authcontroller.protect, viewsController.getCheckout);
router.post(
  '/delete-cart',
  authcontroller.protect,
  viewsController.cartDeleteProduct
); // NOTE not is use now
router.get(
  '/checkout/details',
  authcontroller.protect,
  viewsController.getBasketDetails
);
router.get(
  '/checkout/delivery',
  authcontroller.protect,
  viewsController.getBasketDelivery
);
router.get(
  '/checkout/payment/confirmed',
  authcontroller.protect,
  viewsController.getBasketPaymentConfirmed
);

router.get(
  '/account/details/',
  authcontroller.protect,
  viewsController.getAccountDetails
);
router.get(
  '/account/wishlist/',
  authcontroller.protect,
  viewsController.getAccountWishlist
);
router.get(
  '/my-men/',
  authcontroller.protect,
  viewsController.getAccountOrders
);
router.get(
  '/account/address-book/',
  authcontroller.protect,
  viewsController.getAccountAddressBook
);


router.get('/search', viewsController.getSearch);
router.get('/logintest', viewsController.getLoginTest);

router.get('/signup', viewsController.getSignupForm);

//BUG test with HTML form 👇
router.post(
  '/submit-user-data',
  authcontroller.protect,
  viewsController.updateUserData
);
//router.post('/submit-user-address',authcontroller.protect, viewsController.updateUserAddress);
//errorPage
router.get('/error', viewsController.getError);
// like overview
router.get('/girls', viewsController.getGirl);
router.get('/men/new', viewsController.getMenNew);
router.get('/women/new', viewsController.getGirls);
//TEST
// router.get('/men/newer', viewsController.getMenNewer);

router.get('/men/best-sellers', viewsController.getMenBestSeller);
// Like Tour
//   router.get('/description', viewsController.getDescription);
//router.get('/description/:slug', viewsController.getDescription); // this I what I am goint ot use to query for the controller
router.get('/men/:slug', viewsController.getDescription); // this was '/description/:slug'
router.get('/girls/:slug', viewsController.getDescriptionGirls);

router.get('/sustainability-information', viewsController.getSustainability);

module.exports = router;
