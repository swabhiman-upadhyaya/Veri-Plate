// Data Generator Utility for Plates
const crypto = require('crypto');

const STATE_MAP = {
    'AP': 'Andhra Pradesh', 'AR': 'Arunachal Pradesh', 'AS': 'Assam', 'BR': 'Bihar',
    'CG': 'Chhattisgarh', 'GA': 'Goa', 'GJ': 'Gujarat', 'HR': 'Haryana', 'HP': 'Himachal Pradesh',
    'JH': 'Jharkhand', 'KA': 'Karnataka', 'KL': 'Kerala', 'MP': 'Madhya Pradesh', 'MH': 'Maharashtra',
    'MN': 'Manipur', 'ML': 'Meghalaya', 'MZ': 'Mizoram', 'NL': 'Nagaland', 'OD': 'Odisha',
    'PB': 'Punjab', 'RJ': 'Rajasthan', 'SK': 'Sikkim', 'TN': 'Tamil Nadu', 'TG': 'Telangana',
    'TR': 'Tripura', 'UP': 'Uttar Pradesh', 'UK': 'Uttarakhand', 'WB': 'West Bengal',
    'AN': 'Andaman and Nicobar Islands', 'CH': 'Chandigarh', 'DH': 'Dadra and Nagar Haveli and Daman and Diu',
    'DL': 'Delhi', 'JK': 'Jammu and Kashmir', 'LA': 'Ladakh', 'LD': 'Lakshadweep', 'PY': 'Puducherry'
};

const CAR_MAKES = ['Hyundai', 'Maruti Suzuki', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Kia', 'Ford'];
const CAR_MODELS = {
    'Hyundai': ['Creta', 'i20', 'Venue', 'Verna', 'Tucson'],
    'Maruti Suzuki': ['Swift', 'Baleno', 'Dzire', 'Ertiga', 'Brezza'],
    'Tata': ['Nexon', 'Harrier', 'Safari', 'Altroz', 'Punch'],
    'Mahindra': ['Thar', 'XUV700', 'Scorpio-N', 'Bolero'],
    'Honda': ['City', 'Amaze', 'Elevate', 'WR-V'],
    'Toyota': ['Innova Crysta', 'Fortuner', 'Glanza', 'Urban Cruiser'],
    'Kia': ['Seltos', 'Sonet', 'Carens'],
    'Ford': ['EcoSport', 'Endeavour']
};
const COLORS = ['White', 'Silver', 'Black', 'Grey', 'Red', 'Blue'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric'];

const getDeterministicValue = (hashValue, array) => {
    return array[hashValue % array.length];
};

const generateMockVehicleData = (plateNumber) => {
    // Basic hash of string
    let hash = 0;
    for (let i = 0; i < plateNumber.length; i++) {
        hash = plateNumber.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);

    const stateCode = plateNumber.substring(0, 2).toUpperCase();
    const stateName = STATE_MAP[stateCode] || 'Unknown Region';
    
    const make = getDeterministicValue(hash, CAR_MAKES);
    const modelArray = CAR_MODELS[make];
    const model = getDeterministicValue(hash, modelArray);
    const color = getDeterministicValue(hash, COLORS);
    const fuel = getDeterministicValue(hash, FUEL_TYPES);
    
    // Status Logic based on modulo magic to seem random but deterministic
    const isLicenseValid = (hash % 10) > 1; // 80% Valid
    const isInsuranceValid = (hash % 10) > 2; // 70% Valid
    const isPollutionValid = (hash % 10) > 3; // 60% valid
    
    const violationsCount = hash % 4; // 0 to 3 violations
    const history = [];
    if (violationsCount > 0) {
        const issues = ['Over-speeding', 'Signal Jumping', 'No Parking', 'No Seatbelt'];
        for(let i=0; i < violationsCount; i++) {
            history.push({
                violation: getDeterministicValue(hash + i, issues),
                date: new Date(Date.now() - (hash % 300) * 86400000 - i * 1000000000).toISOString(),
                fineAmount: (hash % 5 + 1) * 500
            });
        }
    }

    return {
        vehicle: {
            plateNumber: plateNumber,
            stateCode: `${stateCode} - ${stateName}`,
            fuelType: fuel,
            owner: {
                name: `RC Owner Ref-${hash.toString().substring(0, 4)}`,
                licenseNumber: `${stateCode}${hash.toString().substring(0, 11)}`,
                licenseValidity: new Date(Date.now() + (isLicenseValid ? 1 : -1) * 10000000000).toISOString()
            },
            vehicle: {
                make,
                model,
                type: 'LMV',
                color,
                year: 2010 + (hash % 14)
            },
            insurance: {
                provider: 'Mock General Insurance Co.'
            },
            pollution: {
                dueDate: new Date(Date.now() + (isPollutionValid ? 1 : -1) * 5000000000).toISOString()
            },
            history: history
        },
        statuses: {
            licenseStatus: isLicenseValid ? 'valid' : 'expired',
            insuranceStatus: isInsuranceValid ? 'valid' : 'expired',
            pollutionStatus: isPollutionValid ? 'valid' : 'expired'
        }
    };
};

module.exports = {
    generateMockVehicleData
};
