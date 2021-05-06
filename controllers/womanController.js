const Woman = require('../models/womanModel');
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
  const features = new APIfeatures(Woman.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const women = await features.query;

  //SEND RESPONSE
  //const women = await Woman.find(); // mens == women

  res.status(200).json({
    status: 'success',
    results: women.length,
    data: {
      women,
    },
  });
});
exports.getOneProduct = catchAsync(async (req, res, next) => {
  const woman = await Woman.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      woman,
    },
  });
});

exports.creatProduct = catchAsync(async (req, res, next) => {
  const newWoman = await Woman.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      products: newWoman,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const woman = await Woman.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }); // req.body is the data that we want to update
  res.status(200).json({
    status: 'success',
    data: {
      woman,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await Woman.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Agregation pipeline
exports.getWomenStats = catchAsync(async (req, res, next) => {
  const stats = await Woman.aggregate([
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
