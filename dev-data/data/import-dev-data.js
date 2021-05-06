/* eslint-disable import/no-useless-path-segments */
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Men = require('./../../models/menModel');
const Women = require('./../../models/womanModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');
// const { dirname } = require('path');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successfull!'));

//READ JSON FILE
// const mensColection = JSON.parse(
//   fs.readFileSync(`${__dirname}/men-simple.json`, 'utf-8')
// );
const mensColection = JSON.parse(
  fs.readFileSync(`${__dirname}/men-simple.json`, 'utf-8')
);
const womenColection = JSON.parse(
  fs.readFileSync(`${__dirname}/women-simple.json`, 'utf-8')
);
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// );

// IMPORT DATA INTO DATA

const importData = async () => {
  try {
    await Men.create(mensColection);
    await Women.create(womenColection);
     await User.create(users);
     //await User.create(users, { validateBeforeSave: false }); // NOTE { validateBeforeSave: false }) remove before
    await Review.create(reviews);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB

const deleteData = async () => {
  try {
    await Men.deleteMany();
     await Women.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
