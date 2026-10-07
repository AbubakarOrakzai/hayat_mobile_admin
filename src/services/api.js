import axios from 'axios'

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

// Every failed request becomes a normal Error with a readable message,
// so pages can just show err.message in a toast.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      (err.request ? 'Cannot reach the server. Is the backend running?' : err.message)
    const error = new Error(message)
    error.status = err.response?.status
    return Promise.reject(error)
  }
)