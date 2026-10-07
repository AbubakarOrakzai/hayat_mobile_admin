import { api } from './api'

export async function getStats() {
  const { data } = await api.get('/dashboard')
  return data
}