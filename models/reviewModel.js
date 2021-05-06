const mongoose = require('mongoose');
const Men = require('./menModel');
const { findByIdAndDelete } = require('./userModel');
//const slugify = require('slugify');
// const validator = require('validator');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: [1, 'Number must be above 1.0'],
      max: [5000, 'Number must be above 5000.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    men: {
      // NOTE by REFERENCING
      type: mongoose.Schema.ObjectId,
      ref: 'Men',
      required: [true, 'Review must belong to a colection'],
    },

    // women: {
    //   // NOTE by REFERENCING
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Women',
    //   required: [true, 'Review must belong to a colection'],
    // },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ men: 1, user: 1, women: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'men',
  //     select: 'name',
  //   }).populate({
  //     path: 'user',
  //     select: 'name photo',
  //   });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (menId) {
  const stats = await this.aggregate([
    {
      $match: { men: menId },
    },
    {
      $group: {
        _id: '$men',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Men.findByIdAndUpdate(menId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Men.findByIdAndUpdate(menId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.men);
});

//findByIdAndUpdate
//findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.men);
});

const Review = mongoose.model('Review', reviewSchema); // MODEl

module.exports = Review;
