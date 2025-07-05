const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  trackingNumber: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  date: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // ✅ MUST HAVE THIS
});

module.exports = mongoose.model('Order', orderSchema);

