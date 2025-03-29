import snmp from "net-snmp";
import os from "os";
import Device from "../models/Device.js";
import DeviceHistory from "../models/DeviceHistory.js";

const OIDS = {
    DEVICE_NAME: "1.3.6.1.2.1.1.5.0", 
    UPTIME: "1.3.6.1.2.1.1.3.0", 
    CPU_LOAD: "1.3.6.1.4.1.2021.10.1.5.1", 
    MEMORY_USAGE: "1.3.6.1.4.1.2021.4.6.0" 
};


const pollSNMP = (device) => {
    return new Promise((resolve) => {
        const session = snmp.createSession(device.device_ip, "public");
        session.get(Object.values(OIDS), async (error, varbinds) => {
            if (error) {
                console.error(`🟥 SNMP Error for ${device.device_ip}:`, error);
                resolve({
                    device_ip: device.device_ip,
                    device_name: device.device_name || "Unknown",
                    device_type: "switch",
                    status: "DOWN",
                    uptime: "0 days 0 hours",
                    cpu_load: 0,
                    memory_usage: 0
                });
            } else {
                const data = {
                    device_ip: device.device_ip,
                    device_name: varbinds[0]?.value.toString() || device.device_ip,
                    device_type: "switch",
                    status: "UP",
                    uptime: `${Math.floor(varbinds[1]?.value / 86400)} days ${Math.floor((varbinds[1]?.value % 86400) / 3600)} hours`,
                    cpu_load: parseFloat(varbinds[2]?.value) || 0,
                    memory_usage: parseFloat(varbinds[3]?.value) || 0
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
        console.error(`🟥 Error fetching server metrics for ${device.device_ip}:`, error);
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

            const newHistory = new DeviceHistory(deviceData);
            await newHistory.save();
            console.log(`✅ Data saved for ${device.device_ip}`);
        }
    } catch (error) {
        console.error("🟥 Error in monitoring loop:", error);
    }
};

setInterval(monitorDevices, 30000);
console.log("🚀 Monitoring started...");
