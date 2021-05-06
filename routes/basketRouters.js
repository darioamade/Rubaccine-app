const express = require('express');

const basketController = require('../controllers/basketController');

const router = express.Router();

router
  .route('/')
  .get(basketController.getAllBaskets)
  .post(basketController.createBasket);

router
  .route('/:id')
  .get(basketController.getBasket)
  .patch(basketController.updateBasket)
  .delete(basketController.deleteBasket);

module.exports = router;
