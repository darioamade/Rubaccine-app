/* eslint-disable import/no-useless-path-segments */
const Men = require('./../models/menModel');
const Cart = require('./../models/cartModel');
const sharp = require('sharp');
const multer = require('multer');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
