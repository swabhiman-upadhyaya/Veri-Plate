const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  plateNumber: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true
  },
  stateCode: { type: String },
  vehicle: {
    make: String,
    model: String,
    year: Number,
    color: String,
    type: { type: String, enum: ['Car', 'Bike', 'Commercial', 'Other'] }
  },
  owner: {
    name: String,
    licenseNumber: String,
    licenseValidity: Date 
  },
  insurance: {
    provider: String,
    expiryDate: Date 
  },
  pollution: {
    lastCheckDate: Date,
    dueDate: Date 
  },
  history: [
    {
      violation: String,
      date: { type: Date, default: Date.now },
      fineAmount: Number
    }
  ]
}, { timestamps: true });

// Instance method to calculate dynamic statuses
vehicleSchema.methods.getDynamicStatus = function() {
  const now = new Date();
  const warningMs = 7 * 24 * 60 * 60 * 1000; // 7 days
  
  const checkStatus = (date) => {
    if (!date) return 'unknown';
    const diff = new Date(date) - now;
    if (diff < 0) return 'expired';
    if (diff < warningMs) return 'expiring soon';
    return 'valid';
  };

  return {
    licenseStatus: checkStatus(this.owner?.licenseValidity),
    insuranceStatus: checkStatus(this.insurance?.expiryDate),
    pollutionStatus: checkStatus(this.pollution?.dueDate)
  };
};

module.exports = mongoose.model('Vehicle', vehicleSchema);
