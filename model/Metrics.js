// const mongoose = require('mongoose');
import mongoose from "mongoose";

const metricsSchema = new mongoose.Schema({
  system_info: {
    HOST_NAME: String,
    ARCHITECTURE: String,
    PLATFORM: String,
    UPTIME: Number,
    VERSION: String,
    RELEASE: String
  },
  MEMORY_INFO: {
    TOTAL: Number,
    USED: Number,
    FREE: Number
  },
  timestamp: { type: Date, default: Date.now }  // Add a timestamp to store when data was saved
});

const Metrics = mongoose.model('Metrics', metricsSchema);

export default Metrics;
