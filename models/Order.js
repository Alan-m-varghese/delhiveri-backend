const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  trackingNumber: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  date: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Order', OrderSchema);


