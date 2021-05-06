const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const girlsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, 'A product must have a name'],
      unique: true,
      trim: true,
      maxLength: [
        40,
        'A product name must have less or equal than 40 character',
      ],
      minLength: [
        8,
        'A product name must have more or equal than 40 character',
      ],
      // validade: [validator.isAlpha, 'Name must only contain characters'],
    },
    slug: String,
    category: {
      type: String,
      defalut: 'Girls',
    },
    categoryType: {
      type: String,
      defalut: 'T-Shirts',
      // lowercase: true,
    },
    subCategory: {
      type: String,
      defalut: 'CLOTHING',
    },
    color: [String],
    stock: {
      type: Number,
      // required: [true, 'A product must have stock'],
      min: [1, 'stock must be above 1.0'],
      max: [100, 'stock must be above 100.0'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      // required: [true, 'A Product must have a price'],
      min: [1, 'Price must be above 1.0'],
      max: [5000, 'Price must be above 5000.0'],
    },
    priceOld: {
      type: Number,
      // required: [true, 'A Product must have a price'],
      min: [1, 'Price must be above 1.0'],
      max: [5000, 'Price must be above 5000.0'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // Only using this validate with THIS keyword
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    status: {
      type: String,
      // required: [true, 'A product must have status'],
    },
    summary: {
      type: String,
      trim: true,
      validade: [validator.isAlpha, 'Name must only contain characters'],
    },
    description: [String],
    detailsProduct: [String],
    // description: {
    //   type: String,
    //   // required: [true, 'A product must have description'],
    //   trim: true,
    // },
    // detailsProduct: [String],
    imageCover: {
      type: String,
      // required: [true, 'A product must have image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    size: [String],
    secretCollection: {
      type: Boolean,
      defalut: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    // startLocation: {
    //   // GeoJSON
    //   type: {
    //     type: String,
    //     default: 'Point',
    //     enum: ['Point'],
    //   },
    //   coordinates: [Number],
    //   address: String,
    //   description: String,
    // },  //BUG
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        // NOTE by REFERENCING
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// menSchema.index({ price: 1 });
girlsSchema.index({ price: 1, ratingAverage: -1 });
girlsSchema.index({ slug: 1 });
girlsSchema.index({ startLocation: '2dsphere' }); //BUG  for GEOSPATIAL

girlsSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//NOTE VIRTUAL POPULATE --> this is how we connect this 2 models
girlsSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'men',
  localField: '_id',
});

//DOCUMENT MIDDLEWARE : Runs before .save() and .create()
girlsSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// menSchema.pre('save', function(next){
//   console.log( 'Will save document')
//   next()
// })

// menSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// menSchema.pre('find', function (next) {
girlsSchema.pre(/^find/, function (next) {
  //NOTE this middleware will work for anything start with find eg. findOne...
  this.find({ secretCollection: { $ne: true } });

  this.start = Date.now();
  next();
});

girlsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangeAt',
  });
  next();
});
girlsSchema.post(/^find/, function (docs, next) {
  // eslint-disable-next-line no-console
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGREGATION MIDDLEWARE
/* menSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretCollection: { $ne: true } } });
  console.log(this.pipeline());
  next();
});
 */
const Girls = mongoose.model('Girls', girlsSchema); // MODEl

module.exports = Girls;
