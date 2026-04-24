import axios from 'axios'
import { getSessionHeaders } from '../utils/session'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.request.use((config) => {
  Object.assign(config.headers, getSessionHeaders())
  return config
})
