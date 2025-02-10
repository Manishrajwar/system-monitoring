import { Router } from "express";
import client from "prom-client"

const collectDefaultMetrics = client.collectDefaultMetrics;

// this will collection  the metrics 
collectDefaultMetrics({register: client.register});

const route = Router();

route.get("/metrics" ,async (req ,res)=>{
    res.setHeader('content-Type' , client.register.contentType)

    const metrics = await client.register.metrics();
    res.send(metrics);

})


export default route;