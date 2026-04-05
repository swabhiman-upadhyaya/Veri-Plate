/**
 * Database Seed Script
 * Run with: npm run seed
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle.model');
const User = require('../models/User.model');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/veriplate');
    
    await Vehicle.deleteMany();
    await User.deleteMany();

    console.log('Cleared existing data...');

    // Add a demo user
    await User.create({
      email: 'admin@veriplate.com',
      role: 'admin'
    });

    // Valid dates
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    // Expired dates
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);

    // Expiring soon (3 days from now)
    const soonDate = new Date();
    soonDate.setDate(soonDate.getDate() + 3);

    const vehicles = [
      {
        plateNumber: 'MH12AB1234', // Mock OCR output
        stateCode: 'MH',
        vehicle: { make: 'Toyota', model: 'Corolla', year: 2020, color: 'White', type: 'Car' },
        owner: { name: 'Ravi Patil', licenseNumber: 'MH1220100012345', licenseValidity: futureDate },
        insurance: { provider: 'HDFC Ergo', expiryDate: soonDate }, // Expiring soon
        pollution: { lastCheckDate: new Date(Date.now() - 100*24*60*60*1000), dueDate: futureDate },
        history: [{ violation: 'Speeding', fineAmount: 1500 }]
      },
      {
        plateNumber: 'KA03PQ1122',
        stateCode: 'KA',
        vehicle: { make: 'Honda', model: 'City', year: 2018, color: 'Red', type: 'Car' },
        owner: { name: 'Kiran Kumar', licenseNumber: 'KA0320180056789', licenseValidity: pastDate }, // Expired
        insurance: { provider: 'ICICI Lombard', expiryDate: pastDate }, // Expired
        pollution: { lastCheckDate: new Date(), dueDate: pastDate },
        history: [{ violation: 'Red Light Jump', fineAmount: 500 }]
      }
    ];

    await Vehicle.insertMany(vehicles);
    console.log('✅ Seeded database successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Failed to seed database:', err);
    process.exit(1);
  }
};

seedData();
