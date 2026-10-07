import { api } from './api'

export async function getLoans() {
  const { data } = await api.get('/loans')
  return data
}

export async function addLoan({ personName, phone, amount, dueDate, notes }) {
  const { data } = await api.post('/loans', { personName, phone, amount: Number(amount), dueDate, notes })
  return data
}

// Loans are never deleted. A repayment only changes the status.
export async function recordRepayment(id, amount) {
  const { data } = await api.patch(`/loans/${id}/payment`, { amount })
  return data
}