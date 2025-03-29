import mongoose from "mongoose"

const DeviceSchema = new mongoose.Schema({
    device_ip: { type: String, required: true }, 
    device_name: { type: String }, 
    device_type: { type: String, enum: ["server", "switch"] }, 
    status: { type: String }, 
    uptime: { type: String, default: "0 days 0 hours" }, 
    cpu_load: { type: Number, default: 0 }, 
    memory_usage: { type: Number, default: 0 }, 
    last_checked: { type: Date, default: Date.now }, 
    down_history: [
        {
            down_time: { type: Date }, 
            up_time: { type: Date } 
        }
    ],
    last_down_time: { type: Date }, 
    last_up_time: { type: Date } ,
    port_1_name: { type: String, default: "Unknown" }, 
    port_1_status: { type: String, enum: ["UP", "DOWN", "Unknown"], default: "Unknown" }, 
});

const Device = mongoose.model("Device", DeviceSchema);
export default Device;  
