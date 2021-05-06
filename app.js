require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDbStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
// const cors = require('cors');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const usersRouter = require('./routes/userRouters');
const reviewRouter = require('./routes/reviewRouter');
const bookingRouter = require('./routes/bookingRoutes');

const menRouter = require('./routes/menRouters');
const womanRouter = require('./routes/womanRouters');
const girlsRouter = require('./routes/girlsRouter');
const basketRouter = require('./routes/basketRouters');
const checkoutRouter = require('./routes/checkoutRouters');
const viewRouter = require('./routes/viewRoutes');

//const accountRouter = require('./routes/accountRouters');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GOBAL MIDDLEWARE

// app.use((req, res, next) => {
//   res.locals.cart = req.session.cart;

//   next();
// })
// app.get('*', function (req, res, next) {
//   res.locals.cart = req.session.cart;
//   next();
// });

//Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));
//note to see the static file http://localhost:4000/overview.html

app.use(express.json());
// Set HTTP headers
//app.use(helmet()); // use in the beginning .best pratice👇 replace
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
    },
  })
);
// app.use(
//   cors({
//     origin: 'http://localhost:4000',
//     credentials: true,
//   })
// );

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, Please  try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // Parse data from body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser()); // Parse data from cookie

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('DB connected....');
});
// Session Store
let mongoStore = new MongoDbStore({
  mongooseConnection: connection,
  collection: 'sessions',
});
// console.log(mongoStore, connection);
// Session Config
/* app.use( NOTE disabled now because i am create a new one test below
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24hours
  })
); */
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoDbStore({ mongooseConnection: mongoose.connection }), //make sure not to open a new connection
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24hours
  })
);
app.use(flash());

app.use(function (req, res, next) {
  res.locals.session = req.session; //NOTE make the session available in the templates
  next();
});
/* app.use(
  session({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection : mongoose.connection}),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
); */

/* app.use({
  secret: "JavaScript is cool",
  store: MongoStore.create({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
}); */

// Data sanitization against NoSQl query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//Prevent parameter polution
//NOTE filters allowed
app.use(
  hpp({
    whitelist: [
      'price',
      'color',
      'description',
      'size',
      'category',
      'subCategory',
      'status',
      'name',
    ],
  })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers); // accessing headers with http req
  //console.log(req.cookies);
  next();
});

// ROUTES
app.use('/', viewRouter);

app.use('/api/v1/men', menRouter); //BUG
app.use('/api/v1/girls', girlsRouter); //BUG
app.use('/api/v1/women', womanRouter); //BUG
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
//NOTE my test stuffs
app.use('/api/v1/basket', basketRouter);
app.use('/api/v1/checkout', checkoutRouter); //details/delivery/review/payment
//app.use('/api/v1/account', accountRouter); //details/wishlist/orders/address-book/

//NOTE UNHANDLED ROUTES and Has to be at the End
app.all('*', (req, res, next) => {
  next(new AppError(` Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;

//OLD CODE
// Mounting all routes to api/v1👇

/* 
app.get('/women', (req, res) => {
  res.status(200).render('women', {
    title: `Women's colection`,
  });
});

app.get('/men', (req, res) => {
  res.status(200).render('men', {
    title: 'Mens colection',

  });
});



app.get('/collections', (req, res) => {
  res.status(200).render('collections', {
    title: 'collections',
  });
});

app.get('/account', (req, res) => {
  res.status(200).render('account', {
    title: 'Whishlist',
  });
}); */

////////////////////////////////
// app.use('/women', womanRouter);  // this will be the firts page  //api/v1/woman
// app.use('/men', menRouter);
// app.use('/api/v1/woman/new', womanRouter);
// app.use('/api/v1/woman/dresses', womanRouter);

// app.use('/api/v1/collections', menRouter);
// app.use('/api/v1/men', menRouter);
// app.use('/api/v1/men/t-shirts', menRouter);

//Render pages
// app.get('/', (req, res) => {
//   res.status(200).render('base', {
//     title: 'Mens colection',
//     user: 'Dario',
//   });
// });

// app.get('/men', (req, res) => {
//   res.status(200).render('men', {
//     title: 'Mens colection',
//   });
// });

// app.get('/collections', (req, res) => {
//   res.status(200).render('collections', {
//     title: 'Mens colection',
//   });
// });

// app.get('/women', (req, res) => {
//   res.status(200).render('women', {
//     title: `Women's colection`,
//   });
// });

// app.get('/new', (req, res) => { // like overview
//   res.status(200).render('new', {
//     title: `New Colection`,
//   });
// });

// app.get('/description', (req, res) => { // Like Tour
//   res.status(200).render('description', {
//     title: `New Colection`,
//   });
// });

/* 

https://stackoverflow.com/questions/66190532/deprecationwarning-listening-to-events-on-the-db-class-has-been-deprecated-and

TEMP Fix. you must remove current mongoose version 
(I was on 5.11.13), and downgrade to mongoose@5.11.15, to resolve it.
*/

/* https://github.com/darioamade/rubaccine-app */

/*  npm run watch:js

npm run start:dev"

*/
