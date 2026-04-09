import axios from 'axios'
import { getToken, logout } from './authService.js'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'
let isHandlingUnauthorized = false

const getErrorMessage = (error) => {
  if (!error.response) return 'Network error. Please check your connection.'
  return error.response?.data?.message || 'Something went wrong'
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = getErrorMessage(error)

    if (!error.response) {
      toast.error(msg)
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      if (!isHandlingUnauthorized) {
        isHandlingUnauthorized = true
        logout()
        toast.error('Session expired. Please login again.')
        window.location.href = '/admin'
      }
    } else if (error.response?.status === 403) {
      toast.error('Access denied')
    } else if (error.response?.status === 429) {
      toast.error('Too many requests. Please slow down.')
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again.')
    } else if (error.response?.status >= 400) {
      toast.error(msg)
    }

    return Promise.reject(error)
  }
)

export default api