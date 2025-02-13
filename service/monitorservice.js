import os from "os";
import Metrics from "../model/Metrics.js";
import Downtime from "../model/Downtime.js";

let lastUptime = 0;  // Store the last recorded uptime

export default {
    getMetrics: async () => {
        try {
            const totalMemory = ((os.totalmem()) / (1024 * 1024)).toFixed(2);
            const freeMemory = ((os.freemem()) / (1024 * 1024)).toFixed(2);
            const currentUptime = parseFloat(((os.uptime()) / 3600).toFixed(2));

            // Check for downtime
            if (currentUptime < lastUptime) {
                console.log("🟥 Downtime Detected!");

                // Save the downtime event in MongoDB
                const newDowntime = new Downtime({
                    startTime: new Date(Date.now() - (lastUptime * 3600 * 1000)), // When it went down
                    endTime: new Date()  // When it came back up
                });

                await newDowntime.save();
                console.log("✅ Downtime Event Saved:", newDowntime);
            }

            // Update lastUptime for the next comparison
            lastUptime = currentUptime;

            return {
                system_info: {
                    HOST_NAME: os.hostname(),
                    ARCHITECTURE: os.arch(),
                    PLATFORM: os.platform(),
                    UPTIME: currentUptime,
                    VERSION: os.version(),
                    RELEASE: os.release(),
                },
                MEMORY_INFO: {
                    TOTAL: totalMemory,
                    FREE: freeMemory,
                    USED: (totalMemory - freeMemory).toFixed(2),
                }
            }
        } catch (error) {
            console.log("Error fetching metrics:", error);
        }
    }
}
