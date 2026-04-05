const liveService = require('../services/live.service');
const { formatResponse } = require('../utils/response.utils');
const { HTTP_STATUS } = require('../constants');

const processMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(false, { error: 'No file uploaded' })
      );
    }
    
    // We instantly return the tracking ID so the frontend can start polling
    const record = await liveService.startAnalysis(req.file);
    return res.status(HTTP_STATUS.OK).json(record);
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const history = await liveService.getHistory();
    return res.status(HTTP_STATUS.OK).json(history);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processMedia,
  getHistory
};
