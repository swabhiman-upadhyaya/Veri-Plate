const mongoose = require('mongoose');

// Records every plate lookup performed by an officer
const scanLogSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  ownerName: { type: String },
  // Snapshot of statuses at scan time
  licenseStatus:   { type: String },
  insuranceStatus: { type: String },
  pollutionStatus: { type: String },
  // Violations that existed at scan time (may be empty for clean vehicles)
  violations: [
    {
      violation:  { type: String },
      fineAmount: { type: Number },
      date:       { type: Date },
    }
  ],
  scannedAt: { type: Date, default: Date.now, index: true },
}, { timestamps: false });

module.exports = mongoose.model('ScanLog', scanLogSchema);
