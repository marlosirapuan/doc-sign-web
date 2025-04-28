import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const api = axios.create({
  baseURL
})

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
