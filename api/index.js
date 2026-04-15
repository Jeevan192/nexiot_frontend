import mongoose from 'mongoose';
import app from '../backend/server.js';

export default async function handler(req, res) {
  if (mongoose.connection.readyState !== 1) {
    try {
      console.log('Serverless: Establishing new DB connection...');
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000
      });
      console.log('Serverless: DB connected.');
    } catch (e) {
      console.error('Serverless: DB Connection Failed!', e);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  return app(req, res);
}