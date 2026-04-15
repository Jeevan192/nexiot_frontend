import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './models/Event.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

const MOCK_EVENTS = [
  {
    event_id: 'ev-1',
    title: 'NeXIoT Club Inauguration',
    description: 'The official launch of NeXIoT Club at CBIT. An event dedicated to fostering innovation, learning, and collaboration in IoT and emerging tech.',
    category: 'Talk',
    status: 'completed',
    date: new Date('2024-11-12T10:00:00Z'),
    time: '10:00 AM - 12:00 PM',
    venue: 'Assembly Hall, CBIT, Hyderabad',
    registered: 250,
    capacity: 250,
    club: 'NEX-IOT',
    icon: '🚀',
    image: '/pdf-images/img_p4_1.png'
  },
  {
    event_id: 'ev-2',
    title: 'Fusion Expo',
    description: 'An exhibition showcasing 17 diverse IoT projects built by student teams tackling real-world challenges, followed by a Q&A and networking session.',
    category: 'Project Sprint',
    status: 'completed',
    date: new Date('2024-11-12T13:00:00Z'),
    time: '1:00 PM - 3:00 PM',
    venue: 'Seminar Hall, R&E Block, CBIT',
    registered: 250,
    capacity: 250,
    club: 'NEX-IOT',
    icon: '⚡',
    image: '/pdf-images/img_p5_1.png'
  }
];

const runSeeder = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not set in environment variables');
    }

    const conn = await mongoose.connect(MONGO_URI);
    console.log(`Connected to DB: ${conn.connection.host}`);
    
    // Check existing
    const existingCount = await Event.countDocuments();
    if(existingCount > 0) {
       console.log('Events already exist... Skipping seed.');
       process.exit(0);
    }
    
    await Event.insertMany(MOCK_EVENTS);
    console.log('Seeded all events successfully onto nexiot_db!');
    process.exit(0);
  } catch (e) {
    console.error('Error seeding DB:', e);
    process.exit(1);
  }
};

runSeeder();
