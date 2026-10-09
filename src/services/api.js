import axios from 'axios'
import { supabase } from '../lib/supbase'

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

// Send the login token with every request. supabase-js refreshes it when it expires.
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Every failed request becomes a normal Error with a readable message.
// If the server says the login is missing or not allowed, send the user back to the login page.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const message =
      err.response?.data?.message ||
      (err.request ? 'Cannot reach the server. Is the backend running?' : err.message)

    if (status === 401 || status === 403) {
      sessionStorage.setItem('auth-notice', message)
      supabase.auth.signOut()
    }

    const error = new Error(message)
    error.status = status
    return Promise.reject(error)
  }
)