import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const token = localStorage.getItem('token')

export const api = axios.create({
  baseURL,
  headers: {
    Authorization: token ? `Bearer ${token}` : ''
  }
})
