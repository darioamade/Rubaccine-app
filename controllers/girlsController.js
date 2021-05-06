const Girl = require('../models/girlModel');
const APIfeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
// ROUTE HANDLER
// NOTE best seller
exports.aliasBestSeller = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-price';
  req.query.fields = 'name,price, color,summary,status';
  next();
};

exports.getAllProducts = catchAsync(async (req, res, next) => {
  //EXECUT THE QUERY
  const features = new APIfeatures(Girl.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const girls = await features.query;

  //SEND RESPONSE
  //const women = await Girl.find(); // mens == women

  res.status(200).json({
    status: 'success',
    results: girls.length,
    data: {
      girls,
    },
  });
});
exports.getOneProduct = catchAsync(async (req, res, next) => {
  const girl = await Girl.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      girl,
    },
  });
});

exports.creatProduct = catchAsync(async (req, res, next) => {
  const newGirl = await Girl.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      products: newGirl,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const girl = await Girl.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }); // req.body is the data that we want to update
  res.status(200).json({
    status: 'success',
    data: {
      girl,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await Girl.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Agregation pipeline
exports.getGirlsStats = catchAsync(async (req, res, next) => {
  const stats = await Girl.aggregate([
    {
      $match: { price: { $gte: 29 } },
    },
    {
      $group: {
        _id: null,
        numCategory: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

/* 
//NOTE using database now no need
// 👇 Here is where I read the data from the JSON file
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/products.json`)
); */
