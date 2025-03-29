import mongoose from "mongoose"

const DeviceHistorySchema = new mongoose.Schema({
    device_ip: { type: String, required: true }, // Server/Switch IP
    device_name: { type: String, required: true }, // Name from SNMP
    device_type: { type: String, enum: ["server", "switch"], required: true }, // Type
    status: { type: String, enum: ["UP", "DOWN"], required: true }, // Status during this log
    uptime: { type: String, default: "0 days 0 hours" }, // Uptime at this moment
    cpu_load: { type: Number, default: 0 }, // CPU Usage at this moment
    memory_usage: { type: Number, default: 0 }, // Memory Usage at this moment
    timestamp: { type: Date, default: Date.now }, // Log timestamp
});

const Device = mongoose.model("DeviceHistory", DeviceHistorySchema);
export default Device;  