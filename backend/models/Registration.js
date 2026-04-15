import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rollNumber: { type: String, required: true },
  phoneNumber: { type: String },
  branch: { type: String },
  year: { type: String },
  semester: { type: String },
  skills: [{ type: String }],
  whyJoin: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null }
}, { timestamps: true });

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
