/**
 * Simulated OCR Service
 * In production, this would interface with an ALPR API or cloud vision service.
 */
exports.simulateOCR = async (imageBase64) => {
  // Simulate network delay of 1.5 seconds for realistic delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real application, this would pass the imageBase64 to an ALPR network 
  // or cloud vision API. Here we yield a dummy plate for the core flow.
  return 'MH12AB1234';
};
