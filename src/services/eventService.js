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
  { id: 1, title: 'NEX-IOT Club Inauguration', date: '2024-10-15', location: 'CBIT Assembly Hall', description: 'The official launch of the NEX-IOT Club, featuring poster unveiling and guest speeches.', status: 'completed' },
  { id: 2, title: 'Fusion Expo 2024', date: '2024-11-20', location: 'Main Campus Grid', description: 'Showcasing 17+ innovative IoT hardware projects built by our very own members.', status: 'completed' },
  { id: 3, title: 'Hardware Demonstrations', date: '2025-01-10', location: 'IoT Lab, Block C', description: 'Hands-on demonstrations and technical review sessions for sensor integrations.', status: 'upcoming' },
];

const initialRegistrations = [
  { id: 101, name: 'Aditi Sharma', email: 'aditi@example.com', rollNo: '160121733001', branch: 'CSE', year: '3', status: 'approved', date: '2024-09-12' },
  { id: 102, name: 'Rahul Verma', email: 'rahul.v@example.com', rollNo: '160121733045', branch: 'ECE', year: '3', status: 'approved', date: '2024-09-13' },
  { id: 103, name: 'Kavya Reddy', email: 'kavya.r@example.com', rollNo: '160122733012', branch: 'IT', year: '2', status: 'pending', date: '2024-09-15' },
];

if (!localStorage.getItem('nexiot_events')) saveDB('events', initialEvents);
if (!localStorage.getItem('nexiot_registrations')) saveDB('registrations', initialRegistrations);

export const getEvents = async () => {
  await delay();
  return { data: getDB('events') };
};

export const getEventById = async (id) => {
  await delay();
  const event = getDB('events').find(e => e.id === Number(id));
  return { data: event };
};

export const createEvent = async (data) => {
  await delay();
  const events = getDB('events');
  const newEvent = { ...data, id: Date.now() };
  saveDB('events', [...events, newEvent]);
  return { data: newEvent };
};

export const updateEvent = async (id, data) => {
  await delay();
  const events = getDB('events');
  const index = events.findIndex(e => e.id === Number(id));
  if (index > -1) {
    events[index] = { ...events[index], ...data };
    saveDB('events', events);
  }
  return { data: events[index] };
};

export const deleteEvent = async (id) => {
  await delay();
  const events = getDB('events').filter(e => e.id !== Number(id));
  saveDB('events', events);
  return { data: { success: true } };
};

export const getEventParticipants = async (id) => {
  await delay();
  return { data: [] }; // Mock empty participants
};

export const submitRegistration = async (data) => {
  await delay();
  const regs = getDB('registrations');
  const newReg = { ...data, id: Date.now(), status: 'pending', date: new Date().toISOString() };
  saveDB('registrations', [...regs, newReg]);
  return { data: newReg };
};

export const getRegistrations = async (params = {}) => {
  await delay();
  return { data: getDB('registrations') };
};

export const getRegistrationById = async (id) => {
  await delay();
  const reg = getDB('registrations').find(e => e.id === Number(id));
  return { data: reg };
};

export const approveRegistration = async (id) => {
  await delay();
  const regs = getDB('registrations');
  const index = regs.findIndex(e => e.id === Number(id));
  if (index > -1) {
    regs[index].status = 'approved';
    saveDB('registrations', regs);
  }
  return { data: regs[index] };
};

export const deleteRegistration = async (id) => {
  await delay();
  const regs = getDB('registrations').filter(e => e.id !== Number(id));
  saveDB('registrations', regs);
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
  const events = getDB('events');
  const regs = getDB('registrations');
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