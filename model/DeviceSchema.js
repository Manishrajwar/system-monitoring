import mongoose from "mongoose"

const DeviceSchema = new mongoose.Schema({
    device_ip: { type: String, required: true }, // Server/Switch IP
    device_name: { type: String }, // Name from SNMP
    device_type: { type: String, enum: ["server", "switch"] }, // Identify type
    status: { type: String }, // Current status
    uptime: { type: String, default: "0 days 0 hours" }, // Last reported uptime
    cpu_load: { type: Number, default: 0 }, // CPU Usage (%)
    memory_usage: { type: Number, default: 0 }, // Memory Usage (%)
    last_checked: { type: Date, default: Date.now }, // Last SNMP poll time
    down_history: [
        {
            down_time: { type: Date }, // When it went down
            up_time: { type: Date } // When it came back up (null if still down)
        }
    ],
    last_down_time: { type: Date }, // Last time it was down
    last_up_time: { type: Date } // Last time it was up
});

const Device = mongoose.model("Device", DeviceSchema);
export default Device;  // ✅ Add this line
