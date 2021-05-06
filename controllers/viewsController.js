const Men = require('../models/menModel');
const Women = require('../models/womanModel');
const Girls = require('../models/girlModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Cart = require('../models/cartModel');
const { creatProduct, getAllProducts } = require('./menController');
// const { request } = require('express');
// const { response } = require('../app');

exports.addToCart = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  //Products.findById ==> Need to find a away to cancat Men + Girls
  Men.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect(req.get('referer'));
  });
});
exports.addToCart2 = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  Girls.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect(req.get('referer'));
  });
});

exports.getCheckout = catchAsync(async (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  const cart = new Cart(req.session.cart);
  const errMsg = req.flash('error')[0];
  res.status(200).render('checkoutPage', {
    //  products: cart.generateArray(),
    totalPrice: cart.totalPrice,
    errMsg: err,
    title: 'Checkout',
  });
});

exports.getCheckout = catchAsync(async (req, res, next) => {
  // if (!req.session.cart) {
  //   return res.redirect('/shopping-cart');
  // }
  // const stripe = Stripe(
  //   'pk_test_51IWNL3JMGciq6dxqMnbSC6S7Sa15oelmIKAEPuQ3E31c7rHhpzJVSMvZsIDcFksrPb8KN3aDnYamqoe46bIlVnMW00nC7lvWaY'
  // );
  // stripe.charges.create(
  //   {
  //     amount: cart.totalPrice * 100,
  //     currency: 'gbp',
  //     description: 'Charge for ',
  //   },
  //   function (err, charge) {
  //     if (err) {
  //       req.flash('error', err.message);
  //       return res.redirect('/checkout');
  //     }
  //     req.flash('success', 'Successfully payment!');
  //     req.cart = null;
  //     res.redirect('/');
  //   }
  // );
  // const cart = new Cart(req.session.cart);
  // res.status(200).render('checkoutPage', {
  //   //  products: cart.generateArray(),
  //   totalPrice: cart.totalPrice,
  //   title: 'Checkout',
  // });
});

exports.getCharge = catchAsync(async (req, res) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  const cart = new Cart(req.session.cart);
  console.log(cart);
  const amount = cart.totalPrice * 100;
  const qty = cart.totalQty;
  const productId = req.params.id;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Products`,
            // images: ['https://i.imgur.com/EHyR2nP.png'],
            // images: [`https://rubaccine.darioamade.com/img/${men.imageCover}`],
            images: [`https://rubaccine.darioamade.com/src/img/pic-1.jpg`],
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:4000/checkout/payment/confirmed',
    // cancel_url: 'https://localhost:4000/cancel',
    cancel_url: 'https://localhost:4000/checkout/payment/confirmed',
  });

  if (req.session.cart) {
    delete req.session.cart;
  }
  res.json({ id: session.id });
});

exports.getSuccess = catchAsync(async (req, res, next) => {
  res.status(200).render('basketPaymentConfrim', {
    title: 'Mens colection',
  });
});

exports.cartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect('/basket');
    })
    // Products.findById ==> Need to find a away to cancat Men + Girls
    .catch((err) => console.log(err));
};
exports.getBasketDetails = catchAsync(async (req, res, next) => {
  res.status(200).render('basketDetail', {
    title: 'Mens colection',
  });
});

exports.getBasketDelivery = catchAsync(async (req, res, next) => {
  const men = await User.find().populate();
  res.status(200).render('basketDeliver', {
    title: 'DELIVERY TO AN ADDRESS',
    men,
  });
});

exports.getBasketPaymentConfirmed = catchAsync(async (req, res, next) => {
  const men = await Men.find().populate();
  res.status(200).render('basketPaymentConfrim', {
    title: 'Payment Confirmed',
    men,
  });
});

exports.getMen = catchAsync(async (req, res, next) => {
  res.status(200).render('men', {
    title: 'Mens colection',
  });
});
exports.getGirl = catchAsync(async (req, res, next) => {
  res.status(200).render('women', {
    title: 'Mens colection',
  });
});

/* exports.aliasBestSeller = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-price';
  req.query.fields = 'name,price, color,summary,status';
  next();
}; */

exports.getCollections = catchAsync(async (req, res, next) => {
  res.status(200).render('collections', {
    title: 'Mens colection',
  });
});

exports.getWomen = catchAsync(async (req, res, next) => {
  res.status(200).render('women', {
    title: `Women's colection`,
  });
});

exports.getGirl = catchAsync(async (req, res, next) => {
  res.status(200).render('women', {
    title: `Women's colection`,
  });
});

exports.getWomenNew = catchAsync(async (req, res, next) => {
  const women = await Women.findOne().populate();
  res.status(200).render('womenNew', {
    title: `New Colection`,
    women, // <-- Here I am passing the data from step 1 to use in the template
  });
});
exports.getGirls = catchAsync(async (req, res, next) => {
  const girls = await Girls.find().populate();
  // 2)n Build template
  // Render template using data from step 1
  res.status(200).render('girlsNew', {
    title: `New Colection`,
    girls, // <-- Here I am passing the data from step 1 to use in the template
  });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  const men = await Men.find().populate();
  res.status(200).render('account', {
    title: `Custumer's account`,
  });
});
exports.getAccountDetails = (req, res) => {
  // const men = await Men.find();
  res.status(200).render('accountDetails', {
    title: `Account's details`,
  });
};
exports.getAccountWishlist = catchAsync(async (req, res, next) => {
  // const men = await Men.find();
  res.status(200).render('accountWhishlist', {
    title: `Account's wishlist`,
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  // 1) find all the ordes thta user as order  *(FIND ALL BOOKINGS)
  const bookings = await Booking.find({ user: req.user.id }); // 👈 all the id orders are saved in bookings ,but this just give me the ID's , now I have to create an array will all IDs and after that query for men(order"men") that contain this IDs

  //console.log(bookings);
  // 2) Find tours with the returned IDs
  const mensIDs = bookings.map((el) => el.men);
  const men = await Men.find({ _id: { $in: mensIDs } }); //IMPORTANT New operator $in
  //console.log(men);
  // const men = await Men.find();
  res.status(200).render('my', {
    title: `Account's orders`,
    men,
  });
});

exports.getAccountOrders = catchAsync(async (req, res, next) => {
  // const men = await Men.find();
  res.status(200).render('accountOrders', {
    title: `Account's orders`,
  });
});
exports.getAccountAddressBook = catchAsync(async (req, res, next) => {
  // const men = await Men.find();
  res.status(200).render('accountAddressBook', {
    title: `Account's address book`,
  });
});

exports.getDetails = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js 'unsafe-inline' 'unsafe-eval';"
    )
    .render('accountDetails', {
      title: `Account Details | Customers `,
    });
};

// like overview
exports.getMenNew = catchAsync(async (req, res, next) => {
  //const men = await Men.find().populate();
  // const men = await Men.find().populate().sort('-categoryType');
  const men = await Men.find()
    .where('subCategory')
    .equals('CLOTHING')
    .populate();

  res.status(200).render('new', {
    title: `New Colection`,
    men, // <-- Here I am passing the data from step 1 to use in the template
  });
});

exports.getTShirt = catchAsync(async (req, res, next) => {

  const men = await Men.find()
    .where('categoryType')
    .equals('T-SHIRT')
    .populate();
  // const men = await Men.find()
  //   .populate({
  //     path: 'status',
  //     match: 'new',
  //   })
  res.status(200).render('new', {
    title: `T-SHIRT`,
    men, // <-- Here I am passing the data from step 1 to use in the template
  });
});
exports.getWatch = catchAsync(async (req, res, next) => {
  // 1) Get all the Men data from collection
  //const men = await Men.find().populate(); // <-- THIS is the data //NOTE
  const men = await Men.find().where('categoryType').equals('Watch').populate();
  res.status(200).render('new', {
    title: `Watch`,
    men, // <-- Here I am passing the data from step 1 to use in the template
  });
});
exports.getBoots = catchAsync(async (req, res, next) => {
  const men = await Men.find().where('categoryType').equals('BOOTS').populate();
  res.status(200).render('new', {
    title: `BOOTS`,
    men, // <-- Here I am passing the data from step 1 to use in the template
  });
});
exports.getShirt = catchAsync(async (req, res, next) => {
  const men = await Men.find().where('categoryType').equals('SHIRT').populate();
  res.status(200).render('new', {
    title: `SHIRT`,
    men, // <-- Here I am passing the data from step 1 to use in the template
  });
});
exports.getJeans = catchAsync(async (req, res, next) => {
  const men = await Men.find().where('categoryType').equals('Jeans').populate();
  res.status(200).render('new', {
    title: `Jeans`,
    men, // <-- Here I am passing the data from step 1 to use in the template
  });
});
exports.getTailoring = catchAsync(async (req, res, next) => {
  const men = await Men.find()
    .where('categoryType')
    .equals('Tailoring')
    .populate();
  res.status(200).render('new', {
    title: `Tailoring`,
    men, // <-- Here I am passing the data from step 1 to use in the template
  });
});
exports.getBest = catchAsync(async (req, res, next) => {
  const men = await Men.find().where('status').equals('BEST SELLER').populate();
  res.status(200).render('new', {
    title: `BEST SELLER`,
    men, // <-- Here I am passing the data from step 1 to use in the template
  });
});
exports.getJacket = catchAsync(async (req, res, next) => {
  const men = await Men.find()
    .where('categoryType')
    .equals('JACKET')
    .populate();
  res.status(200).render('new', {
    title: `JACKET`,
    men, // <-- Here I am passing the data from step 1 to use in the template
  });
});
exports.getOutlet = catchAsync(async (req, res, next) => {
  const men = await Men.find().where('status').equals('OUTLET').populate();
  res.status(200).render('menOutlet', {
    title: `BEST SELLER`,
    men, // <-- Here I am passing the data from step 1 to use in the template
  });
});

exports.getGirlsJacket = catchAsync(async (req, res, next) => {
  const girls = await Girls.find()
    .where('categoryType')
    .equals('Leather Jackets ')
    .populate();
  res.status(200).render('girlsNew', {
    title: `Leather & Jackets`,
    girls, // <-- Here I am passing the data from step 1 to use in the template
  });
});
exports.getGirlsTShirt = catchAsync(async (req, res, next) => {
  const girls = await Girls.find()
    .where('categoryType')
    .equals('T-SHIRT')
    .populate();
  res.status(200).render('girlsNew', {
    title: `T-SHIRTn`,
    girls, // <-- Here I am passing the data from step 1 to use in the template
  });
});

exports.getDresses = catchAsync(async (req, res, next) => {
  const girls = await Girls.find()
    .where('categoryType')
    .equals('Dresses')
    .populate();
  res.status(200).render('girlsNew', {
    title: `Dresses`,
    girls, // <-- Here I am passing the data from step 1 to use in the template
  });
});

exports.getKnitwear = catchAsync(async (req, res, next) => {
  const girls = await Girls.find()
    .where('categoryType')
    .equals('Knitwear')
    .populate();
  res.status(200).render('girlsNew', {
    title: `Knitwear`,
    girls, // <-- Here I am passing the data from step 1 to use in the template
  });
});
exports.getHandbags = catchAsync(async (req, res, next) => {
  const girls = await Girls.find()
    .where('subCategory')
    .equals('Handbags')
    .populate();
  res.status(200).render('girlsNew', {
    title: `Handbags`,
    girls, // <-- Here I am passing the data from step 1 to use in the template
  });
});
exports.getGirlsBoots = catchAsync(async (req, res, next) => {
  const girls = await Girls.find()
    .where('subCategory')
    .equals('All Shoes ')
    .populate();
  res.status(200).render('girlsNew', {
    title: `All Shoes`,
    girls, // <-- Here I am passing the data from step 1 to use in the template
  });
});

exports.getGirlsBestSeller = catchAsync(async (req, res, next) => {
  const girls = await Girls.find()
    .where('status')
    .equals('BEST SELLER')
    .populate();
  res.status(200).render('girlsNew', {
    title: `BEST SELLER`,
    girls, // <-- Here I am passing the data from step 1 to use in the template
  });
});
exports.getGirlsOutlet = catchAsync(async (req, res, next) => {
  const girls = await Girls.find()
    .where('name')
    .equals('BARDI RIB TOP')
    .populate();
  res.status(200).render('girlsOutlet', {
    title: `BEST SELLER`,
    girls, // <-- Here I am passing the data from step 1 to use in the template
  });
});

exports.getReopen = catchAsync(async (req, res, next) => {
  const girls = await Girls.find()
    .where('name')
    .equals('BARDI RIB TOP')
    .populate();
  res.status(200).render('beback', {
    title: `BEST SELLER`,
    girls, // <-- Here I am passing the data from step 1 to use in the template
  });
});

exports.getStoreLocator = catchAsync(async (req, res, next) => {
  res.status(200).render('location', {
    title: `Store Location`,
    // <-- Here I am passing the data from step 1 to use in the template
  });
});

/* NOTE test */
/* exports.getMenNewer = catchAsync(async (req, res, next) => {

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  if(endIndex < users.length){
      results.next = {
        page: page + 1,
        limit: limit,
      };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.results = await Men.find().limit(limit).skip(startIndex).exec()
  res.json(results);

}); */

/* NOTE test */

// Like Tour
exports.getDescription = catchAsync(async (req, res, next) => {
  const men = await Men.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!men) {
    return next(new AppError('There is no item with that name.', 404));
  }

  res.status(200).render('description', {
    title: `${men.name}`,
    men,
  });
});

exports.getDescriptionWomen = catchAsync(async (req, res, next) => {
  const women = await Women.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  res.status(200).render('descriptionWomen', {
    title: `${women.name}`,
    women,
  });
});

exports.getDescriptionGirls = catchAsync(async (req, res, next) => {
  const girls = await Girls.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!girls) {
    return next(new AppError('There is no item with that name.', 404));
  }

  res.status(200).render('descriptionGirls', {
    title: `${girls.name}`,
    girls,
  });
});
// Like Tour
/* exports.getDescription = catchAsync(async (req, res, next) => {
  const men = await Men.findOne({slug: req.params.slug})
  // .populate({
  //   path: 'reviews',
  //   fields: ' review rating user',
  // }); // This time I am using findOne because I don't know which one We are looking

  res.status(200).render('description', {
    title: `New Colection`,
    men,
  });
});
 */

exports.getSustainability = catchAsync(async (req, res, next) => {
  const men = await Men.find().populate();
  res.status(200).render('campagin', {
    title: `New Colection`,
    men,
  });
});

exports.getError = catchAsync(async (req, res, next) => {
  const men = await Men.find().populate();
  res.status(200).render('error', {
    title: `Error`,
    men,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  // console.log('UPADATING USER', req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
      country: req.body.selected,
      home_tel: req.body.home_tel,
      mobile_tel: req.body.mobile_tel,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('accountDetails', {
    title: `Your Account Details`,
    user: updatedUser,
  });
  console.log(updatedUser);
});
/* exports.updateUserData = catchAsync(async (req, res, next) => {
  console.log('UPADATING USER', req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      firstName: req.body.firstName,
      email: req.body.email,
      email_confirm: req.body.email_confirm,
      gender: req.body.gender,
      country: req.body.country,
      home_tel: req.body.home_tel,
      mobile_tel: req.body.mobile_tel,
    },

    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('accountDetails', {
    title: `Your Account Details`,
    user: updatedUser,
  });
  console.log(updatedUser);
}); */

// exports.updateUserAddress = catchAsync(async (req, res, next) => {
//   console.log('UPADATING USER', req.body);
//   const updatedAddress = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       addressline1: req.body.addressline1,
//       addressline2: req.body.addressline2,
//       town: req.body.town,
//       country: req.body.country,
//       countryProvince: req.body.countryProvince,
//       postcode: req.body.postcode,
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   res.status(200).render('accountAddressBook', {
//     title: `Account's address book`,
//     user: updatedAddress,
//   });
// });

/* exports.getMenBestSeller = catchAsync(async (req, res, next) => {
  //  req.query.limit = '5';
  //  req.query.sort = '-price';
  //  req.query.fields = 'name,price, color,summary,status';

  res.status(200).render('menBestSeller', {
    title: `${men.name}`,
    men,
  });
});
 */

//BUG best sellertr not working yet
exports.getMenBestSeller = catchAsync(async (req, res, next) => {
  const men = await Men.findOne().populate();
  if (!men) {
    return next(new AppError('There is no item with that name.', 404));
  }

  res.status(200).render('menBestSeller', {
    title: `${men.name}`,
    men,
  });
});
//localhost:4000/api/v1/men/?categoryType=${query}
//localhost:4000/api/v1/men/?categoryType=Tailoring
//  exports.getSearch = catchAsync(async (req, res, next) => {
//   // req.query.sort = '-price';
//   const { term } = req.query.sort;
//   // const { term } = req.query;
//   const men = await Men.findAll().populate();
//   if (!men) {
//     return next(new AppError('There is no item with that name.', 404));
//   }

//   res.status(200).render('search', {
//     title: `${men.name}`,
//     men,
//   });

//   // const men = await Men.findOne().populate();
//   // if (!men) {
//   //   return next(new AppError('There is no item with that name.', 404));
//   // }

//   // res.status(200).render('search', {
//   //   title: `${men.name}`,
//   //   men,
//   // });
// });

// IMPORTANT CREATECNEW USER
exports.getSignupForm = (req, res) => {
  res.status(200).render('siginUpUser', {
    title: ' Sign Up Account',
  });
};

exports.getLoginTest = catchAsync(async (req, res, next) => {
  const men = await Men.find().populate();
  res.status(200).render('loginPage', {
    title: `New Colection`,
    men,
  });
});

exports.getBasketBeforeLogin = catchAsync(async (req, res, next) => {
  const men = await Men.findOne().populate();
  if (!men) {
    return next(new AppError('There is no item with that name.', 404));
  }

  res.status(200).render('basket', {
    title: `Basket Review`,
    men,
  });
});

exports.getSearch = catchAsync(async (req, res, next) => {
  const men = await Men.findOne().populate();
  if (!men) {
    return next(new AppError('There is no item with that name.', 404));
  }

  res.status(200).render('search', {
    title: `${men.name}`,
    men,
  });

  /* 
  exports.getLoginTest = catchAsync(async (req, res, next) => {
    const men = await Men.findOne().populate();
    if (!men) {
      return next(new AppError('There is no item with that name.', 404));
    }

    res.status(200).render('loginPage', {
      title: `${men.name}`,
      men,
    });getLoginTest

  let result = await Men.aggregate([
    {
      $search: {
        autocomplete: {
          query: `${req.query.term}`,
          path: 'name',
          fuzzy: {
            maxEdits: 2,
          },
        },
      },
    },
  ]).toArray();
  // res.send(result);
  // console.log(result);
  res.status(200).render('search', {
    title: `${men.name}`,
    data: result,
  }); */
});

// exports.aliasSearch = catchAsync(async (req, res, next) => {
//   const { term }  = req.query

//   // console.log(req.query);
//   res.render('search', {
//     // title: `${men.name}`,
//     data: req.query,
//   });
// });
