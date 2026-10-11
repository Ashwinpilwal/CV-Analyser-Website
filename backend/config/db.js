const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cv_analyser';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`! MongoDB Connection Warning: ${error.message}`);
    console.warn('! Application will run with in-memory persistence fallback for offline dev/preview if MongoDB daemon is not running.');
    isConnected = false;
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
