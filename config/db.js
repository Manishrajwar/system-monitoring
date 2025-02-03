// const mongoose = require('mongoose');
import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/serverMetrics', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
