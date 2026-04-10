import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'nexiot-super-secret-club-key-2024';

let db;

async function initializeDB() {
  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.verbose().Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT UNIQUE,
      title TEXT,
      description TEXT,
      category TEXT,
      status TEXT,
      date TEXT,
      time TEXT,
      venue TEXT,
      registered INTEGER DEFAULT 0,
      capacity INTEGER DEFAULT 100,
      club TEXT,
      icon TEXT,
      image TEXT
    );
  `);

  // Insert Admin if not exists
  const adminExists = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
  if (!adminExists) {
    const hashedPw = await bcrypt.hash('nexiot2024', 10);
    await db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hashedPw, 'admin']);
    console.log('Default admin seeded.');
  }

  // Insert seed events if empty
  const eventCount = await db.get('SELECT COUNT(*) as count FROM events');
  if (eventCount.count === 0) {
    await db.run(`INSERT INTO events (event_id, title, description, category, status, date, time, venue, registered, capacity, club, icon, image) VALUES 
      ('ev-1', 'NeXIoT Club Inauguration', 'Official launch of NexIoT Club with 250 attendees.', 'Talk', 'completed', '2024-11-12T10:00:00Z', '10:00 AM - 12:00 PM', 'Assembly Hall, CBIT, Hyderabad', 250, 250, 'NEX-IOT', '🚀', '/pdf-images/img_p5_1.png'),
      ('ev-2', 'Fusion Expo', 'An exhibition showcasing 17 diverse IoT projects built by student teams tackling real-world challenges.', 'Project Sprint', 'completed', '2024-11-12T13:00:00Z', '1:00 PM - 3:00 PM', 'Seminar Hall, R&E Block, CBIT', 250, 250, 'NEX-IOT', '⚡', '/pdf-images/img_p10_1.png')
    `);
    console.log('Default events seeded.');
  }
}

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access token required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

/* --- ROUTES --- */

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id: user.id, name: user.username, role: user.role } });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Events
app.get('/api/events', async (req, res) => {
  try {
    const events = await db.all('SELECT * FROM events');
    const formattedEvents = events.map(e => ({ ...e, id: e.event_id })); // mapping PK for frontend standard
    res.json(formattedEvents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, status, date, time, venue, capacity, image } = req.body;
    const event_id = 'ev-' + Date.now();
    await db.run(
      'INSERT INTO events (event_id, title, description, category, status, date, time, venue, capacity, image, club) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [event_id, title, description, category, status, date, time, venue, capacity, image, 'NEX-IOT']
    );
    res.status(201).json({ message: 'Event created successfully', id: event_id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event' });
  }
});

// Admin Stats
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const eventCountRow = await db.get('SELECT COUNT(*) as count FROM events');
    res.json({ 
      totalMembers: 248, 
      pendingApprovals: 12, 
      upcomingEvents: 4, 
      totalEvents: eventCountRow.count, 
      attendanceToday: 32, 
      thisMonthReg: 28 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

const PORT = process.env.PORT || 8080;

initializeDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Production Backend listening safely on port ${PORT}`);
  });
}).catch(console.error);