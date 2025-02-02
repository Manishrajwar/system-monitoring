import os from "os"

export default {
    getMetrics: async()=>{
         try{

             const totalMemory = ((os.totalmem())/(1024*1024)).toFixed(2);
             const freeMemory  = ((os.freemem())/(1024*1024)).toFixed(2);

            return {
                system_info: {
                    HOST_NAME: os.hostname(),
                    ARCHITECTURE: os.arch(),
                     PLATFORM: os.platform(),
                     UPTIME: ((os.uptime())/3600).toFixed(2),
                     VERSION: os.version(),
                     RELEASE: os.release(),
                },
                MEMORY_INFO:{
                    TOTAL: totalMemory,
                    FREE: freeMemory,
                    USED: totalMemory-freeMemory,
                }
            }
         } catch(error){
             console.log("error",error);
         }
    }
}