import api from './api.js';

export const getEvents = () => api.get('/api/events');
export const createEvent = (data) => api.post('/api/events', data);
export const updateEvent = (id, data) => api.put(`/api/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/api/events/${id}`);

export const submitRegistration = (data) => api.post('/api/registrations', data);
export const getRegistrations = () => api.get('/api/registrations');
export const approveRegistration = (id) => api.put(`/api/registrations/${id}/approve`);
export const deleteRegistration = (id) => api.delete(`/api/registrations/${id}`);
export const exportRegistrations = (format) => api.get(`/api/registrations/export?format=${format}`, { responseType: 'blob' });

export const getDashboardStats = () => api.get('/api/admin/stats');

export const getContacts = () => api.get('/api/contact');
export const submitContact = (data) => api.post('/api/contact', data);
export const resolveContact = (id) => api.put(`/api/contact/${id}`);
export const deleteContact = (id) => api.delete(`/api/contact/${id}`);

export const getConfig = () => api.get('/api/config');
export const updateConfig = (data) => api.put('/api/config', data);

export const getAdmins = () => api.get('/api/auth/admins');
export const createAdmin = (data) => api.post('/api/auth/register-admin', data);
export const deleteAdmin = (id) => api.delete(`/api/auth/admins/${id}`);

// Mock attendance for now
export const getAttendance = () => Promise.resolve({ data: [] });
export const markAttendance = (qrCode) => Promise.resolve({ data: { success: true } });
import api from './api.js'

// ==========================================
// LOCAL STORAGE MOCK DATABASE (No Backend Needed)
// ==========================================
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

const getDB = (key, defaultData = []) => {
  const data = localStorage.getItem(`nexiot_${key}`);
  return data ? JSON.parse(data) : defaultData;
};

const saveDB = (key, data) => {
  localStorage.setItem(`nexiot_${key}`, JSON.stringify(data));
};

// Seed initial authentic data from the PDF if empty
const initialEvents = [
  { 
    id: 1, 
    title: 'NeXIoT Club Inauguration', 
    description: 'The official launch of NeXIoT Club at CBIT. An event dedicated to fostering innovation, learning, and collaboration in IoT and emerging tech.', 
    category: 'Talk', 
    status: 'completed', 
    date: '2024-11-12T10:00:00Z', 
    time: '10:00 AM - 12:00 PM', 
    venue: 'Assembly Hall, CBIT, Hyderabad', 
    registered: 250, 
    capacity: 250, 
    club: 'NEX-IOT', 
    icon: '🚀', 
    image: '/pdf-images/img_p4_1.png' 
  },
  { 
    id: 2, 
    title: 'Fusion Expo', 
    description: 'An exhibition showcasing 17 diverse IoT projects built by student teams tackling real-world challenges, followed by a Q&A and networking session.', 
    category: 'Project Sprint', 
    status: 'completed', 
    date: '2024-11-12T13:00:00Z', 
    time: '1:00 PM - 3:00 PM', 
    venue: 'Seminar Hall, R&E Block, CBIT', 
    registered: 250, 
    capacity: 250, 
    club: 'NEX-IOT', 
    icon: '⚡', 
    image: '/pdf-images/img_p5_1.png' 
  }
];

const initialRegistrations = [
  { id: 101, name: 'Aditi Sharma', email: 'aditi@example.com', rollNo: '160121733001', branch: 'CSE', year: '3', status: 'approved', date: '2024-09-12' },
  { id: 102, name: 'Rahul Verma', email: 'rahul.v@example.com', rollNo: '160121733045', branch: 'ECE', year: '3', status: 'approved', date: '2024-09-13' },
  { id: 103, name: 'Kavya Reddy', email: 'kavya.r@example.com', rollNo: '160122733012', branch: 'IT', year: '2', status: 'pending', date: '2024-09-15' },
];

if (!localStorage.getItem('nexiot_events_v2')) {
  saveDB('events_v2', initialEvents);
  saveDB('registrations_v2', initialRegistrations);
  // Optional: clear old ones
  localStorage.removeItem('nexiot_events');
  localStorage.removeItem('nexiot_registrations');
}

export const getEvents = async () => {
  await delay();
  return { data: getDB('events_v2') };
};

export const getEventById = async (id) => {
  await delay();
  const event = getDB('events_v2').find(e => e.id === Number(id));
  return { data: event };
};

export const createEvent = async (data) => {
  await delay();
  const events = getDB('events_v2');
  const newEvent = { ...data, id: Date.now() };
  saveDB('events_v2', [...events, newEvent]);
  return { data: newEvent };
};

export const updateEvent = async (id, data) => {
  await delay();
  const events = getDB('events_v2');
  const index = events.findIndex(e => e.id === Number(id));
  if (index > -1) {
    events[index] = { ...events[index], ...data };
    saveDB('events_v2', events);
  }
  return { data: events[index] };
};

export const deleteEvent = async (id) => {
  await delay();
  const events = getDB('events_v2').filter(e => e.id !== Number(id));
  saveDB('events_v2', events);
  return { data: { success: true } };
};

export const getEventParticipants = async (id) => {
  await delay();
  return { data: [] }; // Mock empty participants
};

export const submitRegistration = async (data) => {
  await delay();
  const regs = getDB('registrations_v2');
  const newReg = { ...data, id: Date.now(), status: 'pending', date: new Date().toISOString() };
  saveDB('registrations_v2', [...regs, newReg]);
  return { data: newReg };
};

export const getRegistrations = async (params = {}) => {
  await delay();
  return { data: getDB('registrations_v2') };
};

export const getRegistrationById = async (id) => {
  await delay();
  const reg = getDB('registrations_v2').find(e => e.id === Number(id));
  return { data: reg };
};

export const approveRegistration = async (id) => {
  await delay();
  const regs = getDB('registrations_v2');
  const index = regs.findIndex(e => e.id === Number(id));
  if (index > -1) {
    regs[index].status = 'approved';
    saveDB('registrations_v2', regs);
  }
  return { data: regs[index] };
};

export const deleteRegistration = async (id) => {
  await delay();
  const regs = getDB('registrations_v2').filter(e => e.id !== Number(id));
  saveDB('registrations_v2', regs);
  return { data: { success: true } };
};

export const exportRegistrations = async (format = 'csv') => {
  // Mock export implementation for serverless
  await delay();
  const data = "Name,Email,RollNo\nMock,mock@abc.com,12345";
  return { data: new Blob([data], { type: 'text/csv' }) };
};

export const markAttendance = async (qrCode) => {
  await delay();
  return { data: { success: true, message: 'Attendance marked manually' } };
};

export const getAttendance = async (eventId) => {
  await delay();
  return { data: [] };
};

export const getDashboardStats = async () => {
  await delay();
  const events = getDB('events_v2');
  const regs = getDB('registrations_v2');
  return {
    data: {
      totalMembers: regs.filter(r => r.status === 'approved').length,
      upcomingEvents: events.filter(e => e.status === 'upcoming').length,
      totalRegistrations: regs.length,
      recentActivity: [
        { id: 1, text: 'New member registered', time: '2 hours ago' },
        { id: 2, text: 'Event updated', time: '1 day ago' },
      ],
    }
  };
};