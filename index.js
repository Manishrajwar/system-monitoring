import express from "express"
import serverconfig from "./config/serverconfig.js"
import monitorrouter from "./router/monitorrouter.js"
import socketIo from "socket.io"; 
import cors from "cors";  // Import the CORS package


const app = express();
const server = http.createServer(app);  // Create an HTTP server using express
const io = socketIo(server);  // Initialize Socket.IO with the HTTP server

app.use(cors());

app.use(express.static("public"));


// view engine

app.set("view engine" , "ejs");

const PORT = serverconfig.PORT || 5000;

// routes 
app.use("/" ,monitorrouter );


// Real-time monitoring: emit server metrics every 5 seconds
setInterval(async () => {
    const metrics = await monitorservice.getMetrics();
    io.emit("server_metrics", metrics);  // Emit metrics to all connected clients
  }, 5000);

app.listen(PORT , ()=>{
    console.info(`server is running on port ${PORT}`)
})


