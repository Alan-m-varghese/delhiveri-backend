const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authenticateToken = require('../middleware/authMiddleware');  // ✅ Import the middleware

// ✅ Get all orders (only orders belonging to the logged-in user)
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ date: -1 });  // ✅ Only user's orders
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Add new order (only if authenticated)
router.post('/orders', authenticateToken, async (req, res) => {
  try {
    const { title, trackingNumber, status, date } = req.body;

    if (!title || !trackingNumber) {
      return res.status(400).json({ message: 'Title and tracking number are required.' });
    }

    const newOrder = new Order({
      title,
      trackingNumber,
      status,
      date,
      userId: req.user.id,  // ✅ Save the user who created the order
    });

    await newOrder.save();
    res.status(201).json(newOrder);

  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

