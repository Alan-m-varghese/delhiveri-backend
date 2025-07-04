const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  title: String,
  trackingNumber: String,
  status: String,
  date: String,
});

module.exports = mongoose.model('Order', OrderSchema);
