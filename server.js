const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXECTION  💥  Shutting down...');
  console.log(err.name, err.message);

  process.exit(1); // Must shutdown
});

dotenv.config({ path: './config.env' });
const app = require('./app');

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
/* mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successfull!')); */
//console.log(app.get('env'));
// console.log(process.env);

// START SERVER
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(` App running on port  ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLE REJEITION 💥  Shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1); // Option
  });
});

//IMPORTANT
//  node dev-data/data/import-dev-data.js --import
