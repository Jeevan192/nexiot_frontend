import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Models
import User from './models/User.js';
import Event from './models/Event.js';
import Registration from './models/Registration.js';
import Contact from './models/Contact.js';
import Config from './models/Config.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

const app = express();

app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false })); // allows images to load
app.use(express.json());
app.use(morgan('dev'));

const JWT_SECRET = process.env.JWT_SECRET || 'nexiot-super-secret-club-key-2024';

const normalizeRole = (role) => String(role || '').toLowerCase().replace(/[_\s-]/g, '');

const normalizeEvent = (eventDoc) => {
  const raw = eventDoc?.toObject ? eventDoc.toObject() : eventDoc;
  if (!raw) return raw;
  return {
    ...raw,
    id: String(raw._id),
  };
};

// Middleware for auth
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
};

// =======================================
// ROUTES
// =======================================

// 1. Auth/Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      if (user.username === 'admin' && normalizeRole(user.role) !== 'superadmin') {
        user.role = 'superadmin';
        await user.save();
      }
      const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id: user._id, name: user.username, role: user.role } });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

app.post('/api/auth/register-admin', async (req, res) => {
  try {
    const { username, password, secretKey } = req.body;
    const expectedSecret = process.env.ADMIN_SECRET_KEY || 'NEXIOT-SECURE-KEY-2025';
    
    if (secretKey !== expectedSecret) {
      return res.status(403).json({ message: 'Invalid security key' });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newAdmin = await User.create({ username, password, role: 'admin' });
    res.status(201).json({ message: 'Admin account created successfully', user: { username: newAdmin.username } });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get all admins
app.get('/api/auth/admins', protect, async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } }).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins' });
  }
});

// Delete admin by ID
app.delete('/api/auth/admins/:id', protect, async (req, res) => {
  if (normalizeRole(req.user?.role) !== 'superadmin') {
    return res.status(403).json({ message: 'Forbidden. Only superadmins can delete admins.' });
  }
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (normalizeRole(admin.role) === 'superadmin') {
      return res.status(403).json({ message: 'Cannot delete another superadmin account.' });
    }

    if (String(admin._id) === String(req.user._id)) {
      return res.status(403).json({ message: 'You cannot delete your own account.' });
    }

    await admin.deleteOne();
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin' });
  }
});

// Config Settings
app.get('/api/config', async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) config = await Config.create({});
    res.json({ registrationsOpen: config.registrationsOpen });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching config' });
  }
});

app.put('/api/config', protect, async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) config = await Config.create({});
    
    if (req.body.registrationsOpen !== undefined) {
      config.registrationsOpen = req.body.registrationsOpen;
    }
    
    await config.save();
    res.json({ message: 'Config updated successfully', config: { registrationsOpen: config.registrationsOpen } });
  } catch (error) {
    res.status(500).json({ message: 'Error updating config' });
  }
});

// 2. Events Configuration
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).lean();
    const formattedEvents = events.map(normalizeEvent);
    res.json(formattedEvents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

app.post('/api/events', protect, async (req, res) => {
  try {
    const { title, description, category, status, date, time, venue, capacity, image, club, icon } = req.body;
    const event_id = 'ev-' + Date.now();
    const event = await Event.create({
      event_id, title, description, category, status, date, time, venue, capacity, image,
      club: club || 'NEX-IOT', icon: icon || '⚡'
    });
    res.status(201).json(normalizeEvent(event));
  } catch (error) {
    res.status(500).json({ message: 'Error creating event' });
  }
});

  // Update event by ID
app.put('/api/events/:id', protect, async (req, res) => {
  try {
    const { title, description, category, status, date, time, venue, capacity, image, icon } = req.body;
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isObjectId ? { _id: req.params.id } : { event_id: req.params.id };
    const event = await Event.findOneAndUpdate(
      query,
      { title, description, category, status, date, time, venue, capacity, image, icon },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(normalizeEvent(event));
  } catch (error) {
    res.status(500).json({ message: 'Error updating event' });
  }
});

// Delete event by ID
app.delete('/api/events/:id', protect, async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isObjectId ? { _id: req.params.id } : { event_id: req.params.id };
    const event = await Event.findOneAndDelete(query);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event' });
  }
});

// 3. Registrations 
app.post('/api/registrations', async (req, res) => {
  try {
    const { eventId, name, email, rollNumber, phoneNumber, semester } = req.body;

    // First ensure global config allows it unless we check per-event status
    const config = await Config.findOne();
    if (!config || !config.registrationsOpen) {
      return res.status(403).json({ message: 'Registrations are globally closed' });
    }

    let event = null;

    // Resolve event by provided ID (supports both Mongo _id and legacy event_id)
    if (eventId) {
      const eventQuery = mongoose.Types.ObjectId.isValid(eventId)
        ? { _id: eventId }
        : { event_id: eventId };
      event = await Event.findOne(eventQuery);
    }

    // Fallback for general registration forms opened without a specific event.
    if (!event) {
      event = await Event.findOne({ status: { $in: ['open', 'upcoming', 'ongoing'] } }).sort({ date: 1 });
    }

    // Last fallback: use earliest available event if statuses are not maintained.
    if (!event) {
      event = await Event.findOne().sort({ date: 1 });
    }

    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Enforce Capacity logic
    if (event.registered >= event.capacity) {
      return res.status(400).json({ message: 'Sorry, this event is already fully booked.' });
    }

    // Check if already registered
    const existingEntry = await Registration.findOne({ eventId: event._id, rollNumber });
    if(existingEntry) return res.status(400).json({ message: 'Already registered for this event.' });

    // Create Registration
    const registration = await Registration.create({ eventId: event._id, name: req.body.fullName || name, email, rollNumber, phoneNumber: req.body.phone || req.body.phoneNumber, branch: req.body.branch, year: req.body.year, skills: req.body.skills });
    
    // Update Event Tally
    event.registered += 1;
    await event.save();

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Error registering for event' });
  }
});

// Admin Registration GET
app.get('/api/registrations', protect, async (req, res) => {
  try {
    const regs = await Registration.find().populate('eventId', 'title date');
    const formatted = regs.map(r => ({
      id: r._id,
      fullName: r.name,
      rollNumber: r.rollNumber,
      email: r.email,
      phone: r.phoneNumber || 'N/A',
      status: r.status || 'pending',
      createdAt: r.createdAt,
      branch: 'CSE', // placeholder if not captured correctly initially
      year: r.semester || 'N/A',
      eventTitle: r.eventId?.title || 'Unknown Event'
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations' });
  }
});

app.put('/api/registrations/:id/approve', protect, async (req, res) => {
  try {
    const reg = await Registration.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!reg) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Approved!', reg });
  } catch (error) {
    res.status(500).json({ message: 'Error updating registration' });
  }
});

app.delete('/api/registrations/:id', protect, async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting registration' });
  }
});

app.get('/api/registrations/export', protect, async (req, res) => {
  try {
    const regs = await Registration.find().populate('eventId', 'title date');
    
    const headers = ['ID', 'Full Name', 'Roll Number', 'Email', 'Phone', 'Branch', 'Year', 'Event Title', 'Status', 'Created At'];
    const rows = regs.map(r => [
      r._id.toString(),
      r.name || '',
      r.rollNumber || '',
      r.email || '',
      r.phoneNumber || 'N/A',
      r.branch || 'N/A',
      r.semester || 'N/A',
      r.eventId?.title || 'Unknown Event',
      r.status || 'pending',
      new Date(r.createdAt).toLocaleString()
    ]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="registrations-export.csv"');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting registrations' });
  }
});

// 4. Contact Form Route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ message: 'Message sent successfully!', data: contact });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting message' });
  }
});

// Admin Contact Routes
app.get('/api/contact', protect, async (req, res) => {
  try {
    const queries = await Contact.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching queries' });
  }
});

app.put('/api/contact/:id', protect, async (req, res) => {
  try {
    const query = await Contact.findByIdAndUpdate(req.params.id, { isResolved: true }, { new: true });
    res.json({ message: 'Marked resolved', query });
  } catch (error) {
    res.status(500).json({ message: 'Error marking query resolved' });
  }
});

app.delete('/api/contact/:id', protect, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Query deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting query' });
  }
});

// 5. Admin Stats Route
app.get('/api/admin/stats', protect, async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();
    const pendingQueries = await Contact.countDocuments({ isResolved: false });
    
    // Just a basic breakdown mapping original UI layout expectations
    res.json({ 
      totalMembers: totalRegistrations, 
      pendingApprovals: pendingQueries, 
      upcomingEvents: await Event.countDocuments({ status: 'upcoming' }), 
      totalEvents: totalEvents, 
      attendanceToday: 0, 
      thisMonthReg: totalRegistrations 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: err.message || 'Something went wrong on the server',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack 
  });
});

const PORT = process.env.PORT || 8080;
const isServerlessRuntime = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

// Setup initial admin if it doesn't exist or re-sync
const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if(!adminExists) {
            await User.create({ username: 'admin', password: 'nexiot2026', role: 'superadmin' });
            console.log('Seeded default superadmin user: admin | nexiot2026');
        } else {
            // Ensure the password/role are correct as requested
            adminExists.password = 'nexiot2026';
            adminExists.role = 'superadmin';
            await adminExists.save();
            console.log('Admin password synchronized to nexiot2026 and role promoted to superadmin');
        }
    } catch (e) {
        console.error('Seed Admin error:', e);
    }
};

if (!isServerlessRuntime) {
  connectDB().then(() => {
    seedAdmin();
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => console.log(`Development Backend listening on port ${PORT}`));
    }
  });
}

export default app;
