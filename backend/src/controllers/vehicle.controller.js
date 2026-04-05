const Vehicle = require('../models/Vehicle.model');
const Alert = require('../models/Alert.model');
const { formatResponse } = require('../utils/response.utils');
const { simulateOCR } = require('../services/ocr.service');
const { generateMockVehicleData } = require('../utils/mockData');
const { env } = require('../config');
const { HTTP_STATUS, MESSAGES } = require('../constants');

// @desc    Lookup Plate details
// @route   POST /api/lookup
// @access  Private
exports.lookupPlate = async (req, res, next) => {
  try {
    let { plateNumber, image } = req.body;

    if (!plateNumber && !image) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(false, null, MESSAGES.PROVIDE_PLATE_OR_IMAGE)
      );
    }

    if (image && !plateNumber) {
      // Run mock OCR
      plateNumber = await simulateOCR(image);
    }

    // Normalize Plate: e.g. " mh 12 - ab 3456 " -> "MH12AB3456"
    const normalizedPlate = plateNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');

    const mockData = generateMockVehicleData(normalizedPlate);

    // Return the mock result seamlessly simulating a real API
    return res.status(HTTP_STATUS.OK).json(formatResponse(true, {
      vehicle: mockData.vehicle,
      statuses: mockData.statuses
    }));

  } catch (err) {
    next(err);
  }
};

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Private
exports.getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find().sort({ alertDate: -1 }).limit(50);
    res.status(HTTP_STATUS.OK).json(formatResponse(true, alerts));
  } catch (err) {
    next(err);
  }
};

// @desc    Get history aggregating all violations
// @route   GET /api/history
// @access  Private
exports.getHistory = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ 'history.0': { $exists: true } })
                                  .select('plateNumber history vehicle owner')
                                  .lean();
    
    let allHistory = [];
    vehicles.forEach(v => {
      v.history.forEach(h => {
        allHistory.push({
          plateNumber: v.plateNumber,
          ownerName: v.owner?.name,
          violation: h.violation,
          date: h.date,
          fineAmount: h.fineAmount
        });
      });
    });

    allHistory.sort((a,b) => b.date - a.date);
    res.status(HTTP_STATUS.OK).json(formatResponse(true, allHistory));
  } catch (err) {
    next(err);
  }
};

// @desc    Add a new vehicle
// @route   POST /api/vehicles
// @access  Private
exports.addVehicle = async (req, res, next) => {
  try {
    const { plateNumber, stateCode, vehicle, owner, insurance, pollution, history } = req.body;
    
    const normalizedPlate = plateNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');

    const newVehicle = await Vehicle.create({
      plateNumber: normalizedPlate,
      stateCode,
      vehicle,
      owner,
      insurance,
      pollution,
      history
    });

    res.status(HTTP_STATUS.CREATED).json(formatResponse(true, newVehicle));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(false, null, MESSAGES.PLATE_ALREADY_EXISTS)
      );
    }
    next(err);
  }
};
