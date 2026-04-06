const Vehicle = require('../models/Vehicle.model');
const Alert = require('../models/Alert.model');
const ScanLog = require('../models/ScanLog.model');
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
      plateNumber = await simulateOCR(image);
    }

    // Normalize Plate: e.g. " mh 12 - ab 3456 " -> "MH12AB3456"
    const normalizedPlate = plateNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');

    const mockData = generateMockVehicleData(normalizedPlate);
    const mv = mockData.vehicle; // shorthand

    // ── Persist to MongoDB (upsert so re-lookups don't throw duplicate key) ──
    // Extract the raw state code (first 2 chars) for the schema field
    const stateCode = normalizedPlate.substring(0, 2);

    await Vehicle.findOneAndUpdate(
      { plateNumber: normalizedPlate },
      {
        $set: {
          plateNumber:  normalizedPlate,
          stateCode:    stateCode,
          vehicle: {
            make:  mv.vehicle?.make,
            model: mv.vehicle?.model,
            year:  mv.vehicle?.year,
            color: mv.vehicle?.color,
            type:  'Car',
          },
          owner: {
            name:            mv.owner?.name,
            licenseNumber:   mv.owner?.licenseNumber,
            licenseValidity: mv.owner?.licenseValidity ? new Date(mv.owner.licenseValidity) : null,
          },
          insurance: {
            provider:   mv.insurance?.provider || 'Mock General Insurance Co.',
            expiryDate: new Date(Date.now() + (mockData.statuses.insuranceStatus === 'valid' ? 1 : -1) * 10000000000),
          },
          pollution: {
            lastCheckDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            dueDate:       mv.pollution?.dueDate ? new Date(mv.pollution.dueDate) : null,
          },
        },
        // Only set history on first insert — don't overwrite existing violations
        $setOnInsert: {
          history: (mv.history || []).map(h => ({
            violation:  h.violation,
            date:       new Date(h.date),
            fineAmount: h.fineAmount,
          })),
        },
      },
      { upsert: true, new: true }
    );

    // ── Write a ScanLog entry for every lookup ──────────────────────────────
    await ScanLog.create({
      plateNumber:     normalizedPlate,
      ownerName:       mv.owner?.name,
      licenseStatus:   mockData.statuses.licenseStatus,
      insuranceStatus: mockData.statuses.insuranceStatus,
      pollutionStatus: mockData.statuses.pollutionStatus,
      violations: (mv.history || []).map(h => ({
        violation:  h.violation,
        fineAmount: h.fineAmount,
        date:       new Date(h.date),
      })),
    });

    return res.status(HTTP_STATUS.OK).json(formatResponse(true, {
      vehicle: mv,
      statuses: mockData.statuses,
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
    // Return all scan log entries, newest first, limit 200
    const logs = await ScanLog.find()
      .sort({ scannedAt: -1 })
      .limit(200)
      .lean();

    // Shape each log entry — if violations exist, emit one row per violation;
    // otherwise emit one row for the scan itself (clean record)
    const rows = [];
    logs.forEach(log => {
      if (log.violations && log.violations.length > 0) {
        log.violations.forEach(v => {
          rows.push({
            plateNumber: log.plateNumber,
            ownerName:   log.ownerName,
            violation:   v.violation,
            date:        v.date || log.scannedAt,
            fineAmount:  v.fineAmount,
            scannedAt:   log.scannedAt,
          });
        });
      } else {
        // Clean record — show as a scan log entry with no violation
        rows.push({
          plateNumber: log.plateNumber,
          ownerName:   log.ownerName,
          violation:   'Clean Record',
          date:        log.scannedAt,
          fineAmount:  0,
          scannedAt:   log.scannedAt,
        });
      }
    });

    res.status(HTTP_STATUS.OK).json(formatResponse(true, rows));
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
