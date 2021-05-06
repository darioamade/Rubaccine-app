/* eslint-disable import/no-useless-path-segments */
const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
//const APIfeatures = require('./../utils/apiFeatures');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.setMenUserIds = (req, res, next) => {
  //Allow nested routes IMPORTANT
  if (!req.body.men) req.body.men = req.params.menId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);

exports.getOneReview = factory.getOne(Review);

exports.creatReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);

//OLD CODE
/* exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.menId) filter = { men: req.params.menId };
  //EXECUT THE QUERY
  //   const features = new APIfeatures(Review.find(), req.query)
  //     .filter()
  //     .sort()
  //     .limitFields()
  //     .paginate();
  //   const reviews = await features.query;
  const reviews = await Review.find(filter); //.populate('user').populate('men');

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: reviews.length, // only for an array with multples objects
    data: {
      reviews, // dasta files
    },
  });
}); */
/* 
exports.getOneReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id); // NOTE single save to men

  if (!review) {
    return next(new AppError('No review found with that ID ', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
}); */
