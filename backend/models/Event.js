import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  event_id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  registered: { type: Number, default: 0 },
  capacity: { type: Number, default: 100 },
  club: { type: String, required: true },
  icon: { type: String },
  image: { type: String }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
