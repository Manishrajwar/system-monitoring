import express from "express";
import http from "http";  // Import the http module
import serverconfig from "./config/serverconfig.js";
import monitorrouter from "./router/monitorrouter.js";
import monitorservice from "./service/monitorservice.js";  // Import your monitor service
import cors from "cors";  // Import the CORS package
import { Server } from "socket.io";  // Import Server from socket.io

const app = express();
const server = http.createServer(app);  // Create an HTTP server using express

// Allow CORS for both HTTP and WebSocket (Socket.IO)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",  // Frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,  // Allow credentials if needed
  }
});

app.use(cors());
app.use(express.static("public"));

// View engine setup
app.set("view engine", "ejs");

const PORT = serverconfig.PORT || 5000;

// Routes
app.use("/", monitorrouter);

// Real-time monitoring: emit server metrics every 5 seconds
setInterval(async () => {
  try {
    const metrics = await monitorservice.getMetrics();
    console.log("etric",metrics);
    io.emit("server_metrics", metrics);  // Emit metrics to all connected clients
  } catch (error) {
    console.error("Error fetching metrics:", error);
  }
}, 5000);

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Optionally listen for custom events from the client
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

server.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}`);
});
