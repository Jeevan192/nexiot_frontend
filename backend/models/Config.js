import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  registrationsOpen: { type: Boolean, default: false },
  adminSecret: { type: String, default: 'nexiot123' }, // a simple key or use env
}, { timestamps: true });

const Config = mongoose.model('Config', configSchema);
export default Config;
