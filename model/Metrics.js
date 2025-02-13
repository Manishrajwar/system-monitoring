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
  timestamp: {
    type: Date,
    default: Date.now,
    expires: '3d'  // Automatically delete records older than 3 days
  },
  ip:{
    type: String,
  }
});

// Create an index on timestamp for faster queries
metricsSchema.index({ timestamp: 1 });

const Metrics = mongoose.model('Metrics', metricsSchema);

export default Metrics;
// import mongoose from "mongoose";

// const metricsSchema = new mongoose.Schema({
//   system_info: {
//     HOST_NAME: String,
//     ARCHITECTURE: String,
//     PLATFORM: String,
//     UPTIME: Number,
//     VERSION: String,
//     RELEASE: String
//   },
//   MEMORY_INFO: {
//     TOTAL: Number,
//     USED: Number,
//     FREE: Number
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//     expires: '3d'  // Automatically delete records older than 3 days
//   }
// });

// // Create an index on timestamp for faster queries
// metricsSchema.index({ timestamp: 1 });

// const Metrics = mongoose.model('Metrics', metricsSchema);

// export default Metrics;
