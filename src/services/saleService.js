import { api } from './api'

export async function getSales() {
  const { data } = await api.get('/sales')
  return data
}

export async function createSale({ imei, salePrice, customerName, customerPhone, amountPaid }) {
  const { data } = await api.post('/sales', {
    imei,
    salePrice: Number(salePrice),
    customerName,
    customerPhone,
    amountPaid: Number(amountPaid),
  })
  return data
}

export async function recordPayment(id, amount) {
  const { data } = await api.patch(`/sales/${id}/payment`, { amount })
  return data
}