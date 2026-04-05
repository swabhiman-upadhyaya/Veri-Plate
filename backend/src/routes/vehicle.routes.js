const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { lookupPlate, getAlerts, getHistory, addVehicle } = require('../controllers/vehicle.controller');

router.post('/lookup', protect, lookupPlate);
router.get('/alerts', protect, getAlerts);
router.get('/history', protect, getHistory);
router.post('/vehicles', protect, addVehicle);

module.exports = router;
