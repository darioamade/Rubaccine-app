/* eslint-disable import/no-useless-path-segments */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Men = require('../models/menModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked Men
  const men = await Men.findById(req.params.menId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?men=${
      req.params.menId
    }&user=${req.user.id}&price=${men.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/men/${men.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.menId,
    line_items: [
      {
        name: `${men.name} Men`,
        description: men.summary,
        // images: [`https://rubaccine.darioamade.com/img/${men.imageCover}`],
        images: [`https://rubaccine.darioamade.com/src/img/pic-1.jpg`],
        amount: men.price * 100,
        currency: 'gbp',
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});
// Function data creates bookinng

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make booking without paying
  const { men, user, price } = req.query;

  if (!men && !user & !price) return next();
  await Booking.create({ men, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
