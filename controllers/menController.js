/* eslint-disable import/no-useless-path-segments */
const Men = require('./../models/menModel');
const sharp = require('sharp');
const multer = require('multer');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadMenImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

//upload.single('image') req.file
//upload.array('images',5) req.files
exports.resizeMenImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();
  // 1) Cover image
  req.body.imageCover = `men-${req.params.id}-${Date.now}-cover.jpeg`;
  await sharp(req.file.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/men/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, e) => {
      const filename = `men-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/men/${filename}`);

      req.body.images.push(filename);
    })
  );
  next();
});

// ROUTE HANDLER
//NOTE best seler
exports.aliasBestSeller = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-price';
  req.query.fields = 'name,price, color,summary,status';
  next();
};




//NOTE
// exports.aliasTShirts = (req, res, next) => {
//   req.query.limit = '50';
//   req.query.sort = '-price';
//   req.query.fields = 'name,price, color,summary,status,description';
//   next();
// };

//NOTE

exports.getAllProducts = factory.getAll(Men);

exports.getOneProduct = factory.getOne(Men, { path: 'reviews' });

exports.creatProduct = factory.createOne(Men);

exports.updateProduct = factory.updateOne(Men);

exports.deleteProduct = factory.deleteOne(Men); // replaced all code down below with factory

// Agregation pipeline
exports.getMenStats = catchAsync(async (req, res, next) => {
  const stats = await Men.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$subCategory' },
        // numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  /*   {
      $match: { price: { $gte: 29 } },
    },
    {
      $group: {
        _id: { $toUpper: '$subCategory' },
        // _id: '$price',
        numCategory: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]); */
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// GEOSPATIAL QUERY
exports.getMenWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }
  // console.log(distance, lat, lng, unit);
  const men = await Men.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  console.log(men);

  res.status(200).json({
    status: 'success',
    results: men.length,
    data: {
      data: men,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Men.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  // console.log(distances);
  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});

/* const products = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/products.json`)
); */

// OLD CODE
/* exports.getAllProducts = catchAsync(async (req, res, next) => {
  //EXECUT THE QUERY
  const features = new APIfeatures(Men.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const mens = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: mens.length, // only for an array with multples objects
    data: {
      mens, // dasta files
    },
  });
}); */

/* exports.getOneProduct = catchAsync(async (req, res, next) => {
  const men = await Men.findById(req.params.id).populate('reviews'); // NOTE single save to men
  // Men.findOne({_id: req.params.id})

  if (!men) {
    return next(new AppError('No product found with that ID ', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      men,
    },
  });
}); */

// exports.creatProduct = catchAsync(async (req, res, next) => {
//   const newMen = await Men.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       products: newMen,
//     },
//   });
// });

/* exports.updateProduct = catchAsync(async (req, res, next) => {
  const men = await Men.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }); // req.body is the data that we want to update

  if (!men) {
    return next(new AppError('No product found with that ID ', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      men,
    },
  });
}); */

/* exports.deleteProduct = catchAsync(async (req, res, next) => {
  //NOTE here Don't save anything to any variable
  const men = await Men.findByIdAndDelete(req.params.id); // req.body is the data that we want to update

  if (!men) {
    return next(new AppError('No product found with that ID ', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
}); */
