import api from './api.js'

const TOKEN_KEY = 'nextiot_admin_token'
const USER_KEY = 'nextiot_admin_user'

const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  const { token, user } = response.data
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return { token, user }
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