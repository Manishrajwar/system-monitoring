import mongoose from "mongoose";

const downtimeSchema = new mongoose.Schema({
    serverId: String,          // Server identifier
    startTime: Date,           // When downtime started
    endTime: Date              // When the server came back up
  });
  

const Downtime = mongoose.model('Downtime', downtimeSchema);

export default Downtime;
