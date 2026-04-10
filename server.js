import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'nexiot2024') {
    res.json({ token: 'mock-jwt-token-12345', user: { id: 1, name: 'Super Admin', role: 'admin' } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/api/events', (req, res) => res.json([
  { id: 'ev-1', title: 'NeXIoT Club Inauguration', date: '2024-11-12T10:00:00Z', time: '10:00 AM - 12:00 PM', venue: 'Assembly Hall, CBIT', category: 'Talk', status: 'completed', image: '/pdf-images/img_p5_1.png', description: 'Official launch of NexIoT Club with 250 attendees.' },
  { id: 'ev-2', title: 'Fusion Expo', date: '2024-11-12T13:00:00Z', time: '1:00 PM - 3:00 PM', venue: 'Seminar Hall, R&E Block, CBIT', category: 'Fest', status: 'completed', image: '/pdf-images/img_p10_1.png', description: 'Exhibition of 17 diverse IoT projects.' }
]));

app.get('/api/admin/stats', (req, res) => res.json({ totalMembers: 248, pendingApprovals: 12, upcomingEvents: 4, totalEvents: 18, attendanceToday: 32, thisMonthReg: 28 }));

app.listen(5000, () => console.log('Backend running on port 5000'));
