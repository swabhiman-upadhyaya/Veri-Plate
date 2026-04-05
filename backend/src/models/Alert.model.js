const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: true,
    index: true
  },
  alertType: {
    type: String,
    enum: ['License Expiry', 'Pollution Due', 'Insurance Expiry', 'Flagged'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  alertDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', alertSchema);
