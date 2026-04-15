import api from './api.js';

export const getEvents = () => api.get('/api/events');
export const getEventById = (id) => api.get("/api/events/");
export const createEvent = (data) => api.post('/api/events', data);
export const updateEvent = (id, data) => api.put("/api/events/", data);
export const deleteEvent = (id) => api.delete("/api/events/");

export const submitRegistration = (data) => api.post('/api/registrations', data);
export const getRegistrations = () => api.get('/api/registrations');
export const getRegistrationById = (id) => api.get("/api/registrations/");
export const approveRegistration = (id) => api.put("/api/registrations//approve");
export const deleteRegistration = (id) => api.delete("/api/registrations/");
export const exportRegistrations = (format) => api.get("/api/registrations/export?format=", { responseType: 'blob' });

export const getDashboardStats = () => api.get('/api/admin/stats');

export const getContacts = () => api.get('/api/contact');
export const submitContact = (data) => api.post('/api/contact', data);
export const resolveContact = (id) => api.put("/api/contact/");
export const deleteContact = (id) => api.delete("/api/contact/");

export const getConfig = () => api.get('/api/config');
export const updateConfig = (data) => api.put('/api/config', data);

export const getAdmins = () => api.get('/api/auth/admins');
export const createAdmin = (data) => api.post('/api/auth/register-admin', data);
export const deleteAdmin = (id) => api.delete("/api/auth/admins/");

// Attendance
export const getAttendance = () => Promise.resolve({ data: [] });
export const markAttendance = (qrCode) => Promise.resolve({ data: { success: true } });

