const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// Add new order
router.post('/', async (req, res) => {
  const { title, trackingNumber, status, date } = req.body;
  const newOrder = new Order({ title, trackingNumber, status, date });
  await newOrder.save();
  res.json(newOrder);
});

module.exports = router;
