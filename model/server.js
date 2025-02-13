import mongoose from 'mongoose';

const serverSchema = new mongoose.Schema({
  name: String,
  ip: String,
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const Server = mongoose.model('Server', serverSchema);
export default Server;