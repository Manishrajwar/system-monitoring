import mongoose from "mongoose"

const DeviceHistorySchema = new mongoose.Schema({
    device_ip: { type: String },
    device_name: { type: String },
    device_type: { type: String, enum: ["server", "switch"],  }, 
    status: { type: String, enum: ["UP", "DOWN"] },
    uptime: { type: String, default: "0 days 0 hours" }, 
    cpu_load: { type: Number, default: 0 },
    memory_usage: { type: Number, default: 0 },

      port_1_name: { type: String, default: "Unknown" }, 
      port_1_status: { type: String, enum: ["UP", "DOWN", "Unknown"], default: "Unknown" }, 
      incoming_traffic: { type: Number, default: 0 }, 
      outgoing_traffic: { type: Number, default: 0 }, 
      
    timestamp: { type: Date, default: Date.now }, 
});

const Device = mongoose.model("DeviceHistory", DeviceHistorySchema);
export default Device;  