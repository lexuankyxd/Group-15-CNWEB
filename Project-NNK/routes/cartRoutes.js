const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { customerId: req.body.customerId },
      { $push: { items: req.body.items } },
      { new: true, upsert: true }
    );
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get cart by customerId
router.get('/:customerId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: req.params.customerId });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
