import api from './api.js'

export const getEvents = () => api.get('/events')
export const getEventById = (id) => api.get(`/events/${id}`)
export const createEvent = (data) => api.post('/events', data)
export const updateEvent = (id, data) => api.put(`/events/${id}`, data)
export const deleteEvent = (id) => api.delete(`/events/${id}`)
export const getEventParticipants = (id) => api.get(`/events/${id}/participants`)

export const submitRegistration = (data) => api.post('/registrations', data)
export const getRegistrations = (params) => api.get('/registrations', { params })
export const getRegistrationById = (id) => api.get(`/registrations/${id}`)
export const approveRegistration = (id) => api.put(`/registrations/${id}/approve`)
export const deleteRegistration = (id) => api.delete(`/registrations/${id}`)
export const exportRegistrations = (format = 'csv') =>
  api.get('/registrations/export', {
    params: { format },
    responseType: 'blob',
  })

export const markAttendance = (qrCode) => api.post('/attendance/scan', { qrCode })
export const getAttendance = (eventId) =>
  api.get('/attendance', {
    params: eventId ? { eventId } : undefined,
  })

export const getDashboardStats = () => api.get('/admin/stats')