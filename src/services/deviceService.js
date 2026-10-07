import { api } from './api'

export async function getDevices() {
  const { data } = await api.get('/devices')
  return data
}

// Returns null when the IMEI is not in the system.
export async function getDeviceByImei(imei) {
  try {
    const { data } = await api.get(`/devices/imei/${imei}`)
    return data
  } catch (err) {
    if (err.status === 404) return null
    throw err
  }
}

export async function addDevice({ imei, productId, costPrice, salePrice }) {
  const { data } = await api.post('/devices', {
    imei,
    productId,
    costPrice: Number(costPrice),
    salePrice: Number(salePrice),
  })
  return data
}

export async function updateDevicePrices(id, { costPrice, salePrice }) {
  const { data } = await api.put(`/devices/${id}`, { costPrice: Number(costPrice), salePrice: Number(salePrice) })
  return data
}

export async function deleteDevice(id) {
  await api.delete(`/devices/${id}`)
}