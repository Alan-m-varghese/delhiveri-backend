const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

// Get orders for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  const orders = await Order.find({ user: req.userId });
  res.json(orders);
});

// Add new order
router.post('/', authMiddleware, async (req, res) => {
  const { title, trackingNumber, status, date } = req.body;
  const newOrder = new Order({ title, trackingNumber, status, date, user: req.userId });
  await newOrder.save();
  res.json(newOrder);
});

module.exports = router;
