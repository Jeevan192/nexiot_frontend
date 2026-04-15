import api from './api.js'

const TOKEN_KEY = 'nextiot_admin_token'
const USER_KEY = 'nextiot_admin_user'

export const login = async (credentials) => {
  const res = await api.post('/api/auth/login', credentials)
  localStorage.setItem(TOKEN_KEY, res.data.token)
  localStorage.setItem(USER_KEY, JSON.stringify(res.data.user))
  return res
}

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    logout()
    return null
  }
}

export const isAuthenticated = () => !!getToken()
import api from './api.js'

const TOKEN_KEY = 'nextiot_admin_token'
const USER_KEY = 'nextiot_admin_user'

const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const login = async (credentials) => {
  // Bypassing real backend and using local mock auth
  if (credentials.username === 'admin' && credentials.password === 'nexiot2024') {
    const mockToken = 'mock_jwt_token_for_admin_portal'
    const mockUser = { id: 1, username: 'admin', role: 'admin' }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    localStorage.setItem(TOKEN_KEY, mockToken)
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser))
    return { token: mockToken, user: mockUser }
  } else {
    throw { response: { data: { message: 'Invalid credentials. Only admin access allowed.' } } }
  }
}

export const logout = () => {
  clearAuthStorage()
}

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    clearAuthStorage()
    return null
  }
}

export const isAuthenticated = () => !!getToken()