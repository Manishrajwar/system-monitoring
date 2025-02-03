import express from "express";
import http from "http";  
import serverconfig from "./config/serverconfig.js";
import monitorrouter from "./router/monitorrouter.js";
import monitorservice from "./service/monitorservice.js";  
import cors from "cors";  
import { Server } from "socket.io";  
import Metrics from "./model/Metrics.js"
import mongoose from "mongoose";

const app = express();
const server = http.createServer(app);  

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,  
  }
});

app.use(cors());
app.use(express.static("public"));
app.use(express.json()); 


mongoose.connect('mongodb://localhost:27017/serverMetrics', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
    });

app.set("view engine", "ejs");

const PORT = serverconfig.PORT || 5000;

app.use("/", monitorrouter);



// POST route to save metrics data
app.post('/save-metrics', async (req, res) => {
    try {
      const { system_info, MEMORY_INFO } = req.body;
    console.log("system_info" , system_info , "MEMORY_INFO" , MEMORY_INFO);
      const newMetrics = new Metrics({
        system_info,
        MEMORY_INFO
      });
  
      await newMetrics.save();
      console.log("newMetrics",newMetrics);
      
      res.status(201).json({ message: 'Metrics saved successfully!' });
    } catch (error) {
      console.error('Error saving metrics:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  

app.get('/allMetrics', async (req, res) => {
    try {
      const metrics = await Metrics.find().limit(10); 
      res.status(200).json(metrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  

setInterval(async () => {
  try {
    const metrics = await monitorservice.getMetrics();
    io.emit("server_metrics", metrics); 
  } catch (error) {
    console.error("Error fetching metrics:", error);
  }
}, 5000);

setInterval(async () => {
  try {
    const metrics = await Metrics.find().limit(10); 
    io.emit("allMetrics", metrics); 
  } catch (error) {
    console.error("Error fetching metrics:", error);
  }
}, 5000);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

server.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}`);
});
