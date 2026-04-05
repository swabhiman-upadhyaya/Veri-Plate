const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { generateMockVehicleData } = require('../utils/mockData');

// In-memory store for demonstration instead of DB since we want basic polling
let history = [];

const getHistory = async () => {
    return history;
};

const startAnalysis = async (file) => {
    const ext = path.extname(file.originalname);
    const isVideo = ['.mp4', '.avi', '.mov', '.mkv'].includes(ext.toLowerCase());
    const id = file.filename.split('.')[0];
    
    const outputFileName = `${id}${isVideo ? '.mp4' : '.jpg'}`;
    const outputDir = path.join(__dirname, '../../outputs');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    
    const outputPath = path.join(outputDir, outputFileName);
    
    const record = {
        id,
        filename: file.filename,
        plate: 'Scanning...',
        timestamp: new Date().toISOString(),
        type: isVideo ? 'video' : 'image',
        status: 'processing',
        output_url: null,
        details: null
    };
    
    history.unshift(record);
    
    // Asynchronously start python process
    processInBg(file.path, outputPath, id);
    
    return record;
};

const processInBg = (inputPath, outputPath, recordId) => {
    const scriptPath = path.join(__dirname, '../../ml_engine/processor.py');
    
    // Spawn python script
    const pyProcess = spawn('python', [scriptPath, '--input', inputPath, '--output', outputPath]);
    
    let pythonOutput = '';
    let pythonStderrStr = '';
    
    pyProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
    });
    
    pyProcess.stderr.on('data', (data) => {
        pythonStderrStr += data.toString();
        console.error(`Python stderr: ${data}`);
    });
    
    pyProcess.on('close', (code) => {
        const recordIndex = history.findIndex(r => r.id === recordId);
        if (recordIndex === -1) return;
        
        let pyErr = '';
        if (code !== 0) {
            try {
                // Check if Python gracefully exited with 1 and printed a JSON error (e.g. missing modules)
                const outputLines = pythonOutput.trim().split('\n');
                const result = JSON.parse(outputLines[outputLines.length - 1]);
                if (result.error) pyErr = result.error;
            } catch(e) {
                // Otherwise it's a raw traceback
                // We truncate to last 150 chars to fit gracefully in the UI
                pyErr = pythonStderrStr.replace(/\n/g, ' ').slice(-150);
            }
            
            history[recordIndex].status = 'failed';
            history[recordIndex].error_msg = pyErr || 'Unknown Python Crash';
            return;
        }
        
        try {
            // Find the last JSON string outputted by the script
            const outputLines = pythonOutput.trim().split('\n');
            const resultJsonLine = outputLines[outputLines.length - 1];
            const result = JSON.parse(resultJsonLine);
            
            if (result.error) {
                 history[recordIndex].status = 'failed';
            } else {
                 history[recordIndex].status = 'completed';
                 history[recordIndex].plate = result.plate;
                 history[recordIndex].is_valid = result.is_valid;
                 history[recordIndex].output_url = `outputs/${path.basename(outputPath)}`;
                 
                 // Generate intelligent mock data correlated to this plate
                 const mockPayload = generateMockVehicleData(result.plate);
                 history[recordIndex].details = mockPayload.vehicle;
            }
        } catch (err) {
            console.error('Failed to parse Python Output:', err, pythonOutput);
            history[recordIndex].status = 'failed';
        }
    });
};

module.exports = {
    startAnalysis,
    getHistory
};
