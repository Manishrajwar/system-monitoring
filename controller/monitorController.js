import monitorservice from "../service/monitorservice.js";

export default {
     getMetrics: async(req ,res)=>{
         try{
            const metrics = await monitorservice.getMetrics();
            console.log("metics",metrics);
             res.status(200).json({
                metrics
             })
         } catch(error){
            console.log("error",error)
         }
     },
     monitor:(req ,res)=>{
         try{
             res.sendStatus(200);
         } catch(error){
            console.log("error",error)
         }
     },
}