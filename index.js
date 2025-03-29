import snmp from "net-snmp";
import os from "os";
import Device from "./model/DeviceSchema.js";
import DeviceHistory from "./model/DeviceHistory.js";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import cors from "cors"; 


 // CPU_LOAD: "1.3.6.1.4.1.2021.10.1.5.1", 
    // MEMORY_USAGE: "1.3.6.1.4.1.2021.4.6.0" 

const app = express();

const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"]
    }
});


app.use(cors())

app.use(express.json()); 

mongoose.connect('mongodb://127.0.0.1:27017/servermonitoring')  
  .then(() => console.log(' Connected to MongoDB'))
  .catch(err => console.error(' MongoDB connection error:', err));


const OIDS = {
    DEVICE_NAME: "1.3.6.1.2.1.1.5.0", 
    UPTIME: "1.3.6.1.2.1.1.3.0", 
    PORT_1_NAME: "1.3.6.1.2.1.2.2.1.2.1",
    PORT_1_STATUS: "1.3.6.1.2.1.2.2.1.8.1",
    INCOMING_TRAFFIC: "1.3.6.1.2.1.31.1.1.1.6.1",
    OUTGOING_TRAFFIC: "1.3.6.1.2.1.31.1.1.1.10.1"
   
};

const pollSNMP = (device) => {
    return new Promise((resolve) => {
        const session = snmp.createSession(device.device_ip, "public");
        session.get(Object.values(OIDS), async (error, varbinds) => {
            if (error) {
                console.error(` SNMP Error for ${device.device_ip}:`, error);
                resolve({
                    // device_ip: device.device_ip,
                    // device_name: device.device_name || "Unknown",
                    // device_type: "switch",
                    // status: "DOWN",
                    // uptime: "0 days 0 hours",
                    // cpu_load: 0,
                    // memory_usage: 0
                    device_ip: device.device_ip,
                    device_name: device.device_name || "Unknown",
                    device_type: "switch",
                    status: "DOWN",
                    uptime: "0 days 0 hours",
                    port_1_name: "Unknown",
                    port_1_status: "Unknown",
                    incoming_traffic: 0,
                    outgoing_traffic: 0
                });
            } else {
                const data = {
                    // device_ip: device.device_ip,
                    // device_name: varbinds[0]?.value.toString() || device.device_ip,
                    // device_type: "switch",
                    // status: "UP",
                    // uptime: `${Math.floor(varbinds[1]?.value / 86400)} days ${Math.floor((varbinds[1]?.value % 86400) / 3600)} hours`,
                    // cpu_load: parseFloat(varbinds[2]?.value) || 0,
                    // memory_usage: parseFloat(varbinds[3]?.value) || 0
                    device_ip: device.device_ip,
                    device_name: varbinds[0]?.value.toString() || device.device_ip,
                    device_type: "switch",
                    status: "UP",
                    uptime: `${Math.floor(varbinds[1]?.value / 86400)} days ${Math.floor((varbinds[1]?.value % 86400) / 3600)} hours`,
                    port_1_name: varbinds[2]?.value.toString() || "Unknown",
                    port_1_status: varbinds[3]?.value === 1 ? "UP" : "DOWN",
                    incoming_traffic: parseFloat(varbinds[4]?.value) || 0,
                    outgoing_traffic: parseFloat(varbinds[5]?.value) || 0
                };
                resolve(data);
            }
            session.close();
        });
    });
};

const getServerMetrics = async (device) => {
    try {
        const totalMemory = (os.totalmem() / (1024 * 1024)).toFixed(2);
        const freeMemory = (os.freemem() / (1024 * 1024)).toFixed(2);
        const usedMemory = (totalMemory - freeMemory).toFixed(2);
        const uptime = Math.floor(os.uptime() / 86400) + " days " + Math.floor((os.uptime() % 86400) / 3600) + " hours";

        return {
            device_ip: device.device_ip,
            device_name: os.hostname(),
            device_type: "server",
            status: "UP",
            uptime: uptime,
            cpu_load: Math.random() * 50, 
            memory_usage: usedMemory
        };
    } catch (error) {
        console.error(` Error fetching server metrics for ${device.device_ip}:`, error);
        return {
            device_ip: device.device_ip,
            device_name: "Unknown",
            device_type: "server",
            status: "DOWN",
            uptime: "0 days 0 hours",
            cpu_load: 0,
            memory_usage: 0
        };
    }
};


const monitorDevices = async () => {
    try {
        const devices = await Device.find(); 
        for (const device of devices) {
            let deviceData;
            if (device.device_type === "switch") {
                deviceData = await pollSNMP(device);
            } else {
                deviceData = await getServerMetrics(device);
            }


            console.log("deviedata " , deviceData);
            const newHistory = new DeviceHistory(deviceData);
            await newHistory.save();
            console.log(` Data saved for ${device.device_ip}`);

     await Device.findByIdAndUpdate(device._id, {
        device_name: deviceData.device_name,
        status: deviceData.status,
        uptime: deviceData.uptime,
        cpu_load: deviceData.cpu_load,
        memory_usage: deviceData.memory_usage,
        last_checked: new Date(),
        last_down_time: deviceData.status === "DOWN" ? new Date() : device.last_down_time,
        last_up_time: deviceData.status === "UP" ? new Date() : device.last_up_time
    });

        }
    } catch (error) {
        console.error(" Error in monitoring loop:", error);
    }
};

setInterval(monitorDevices, 30000);
console.log(" Monitoring started...");

app.post("/add-device", async (req, res) => {
    try {
        const { device_ip, device_type } = req.body;

        if (!device_ip || !device_type) {
            return res.status(400).json({ error: "device_ip and device_type are required" });
        }

        const newDevice = new Device({
            device_ip,
            device_type,
            status: "UNKNOWN", 
            uptime: "0 days 0 hours",
            cpu_load: 0,
            memory_usage: 0,
            last_checked: new Date(),
            down_history: [],
            last_down_time: null,
            last_up_time: null
        });

        await newDevice.save();
        res.status(201).json({ message: "Device added successfully", device: newDevice });
    } catch (error) {
        console.error("Error adding device:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


io.on("connection", (socket) => {
    console.log(" New client connected:", socket.id);
    
    socket.on("disconnect", () => {
        console.log(" Client disconnected:", socket.id);
    });
});

app.get("/get-devices", async (req, res) => {
    try {
        const devices = await Device.find();
        res.status(200).json(devices);

        io.emit("deviceData", devices);
    } catch (error) {
        console.error("Error fetching devices:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.post("/get-device-details", async (req, res) => {
    try {
        const { device_ip } = req.body;

        if (!device_ip) {
            return res.status(400).json({ error: "device_ip is required" });
        }

        let device = await Device.findOne({ device_ip });

        if (!device) {
            device = new Device({
                device_ip,
                device_type: "unknown", 
                status: "UNKNOWN",
                uptime: "0 days 0 hours",
                cpu_load: 0,
                memory_usage: 0,
                last_checked: new Date(),
                last_down_time: null,
                last_up_time: null
            });
            await device.save();
            console.log(`New device added: ${device_ip}`);
        }

        let deviceData;
        if (device.device_type === "switch") {
            deviceData = await pollSNMP(device);
        } else {
            deviceData = await getServerMetrics(device);
        }

        const newHistory = new DeviceHistory(deviceData);
        await newHistory.save();

        await Device.findByIdAndUpdate(device._id, {
            device_name: deviceData.device_name,
            status: deviceData.status,
            uptime: deviceData.uptime,
            cpu_load: deviceData.cpu_load,
            memory_usage: deviceData.memory_usage,
            last_checked: new Date(),
            last_down_time: deviceData.status === "DOWN" ? new Date() : device.last_down_time,
            last_up_time: deviceData.status === "UP" ? new Date() : device.last_up_time
        });

        res.status(200).json(deviceData);

        io.emit(`deviceData-${device_ip}`, deviceData);

    } catch (error) {
        console.error("Error fetching device details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/getDeviceHistory" , async(req ,res)=>{
     const {device_ip} = req.body;

      const allhistory = await DeviceHistory.find({device_ip}).sort({date:-1});

       return res.status(200).json({
        status:true , 
        data: allhistory
       })
})
app.post("/removeDeviceip" , async(req ,res)=>{
     const {device_id} = req.body;

    const resp = await Device.findByIdAndDelete(device_id);

       return res.status(200).json({
        status:true , 
        data: resp
       })
})



app.listen(5500, () => console.log("Server running on port 5000"));






