import { api } from './api'

// Product forms can include a photo, so they go as FormData.
function toFormData(data) {
  const fd = new FormData()
  fd.append('brand', data.brand)
  fd.append('model', data.model)
  fd.append('condition', data.condition)
  fd.append('category', data.category)
  fd.append('description', data.description || '')
  fd.append('specs', JSON.stringify(data.specs || {}))
  if (data.imageFile) fd.append('image', data.imageFile)
  else if (!data.image) fd.append('removeImage', 'true')
  return fd
}

export async function getProducts() {
  const { data } = await api.get('/products')
  return data
}

export async function getProduct(id) {
  try {
    const { data } = await api.get(`/products/${id}`)
    return data
  } catch (err) {
    if (err.status === 404) return null
    throw err
  }
}

export async function addProduct(form) {
  const { data } = await api.post('/products', toFormData(form))
  return data
}

export async function updateProduct(id, form) {
  const { data } = await api.put(`/products/${id}`, toFormData(form))
  return data
}

export async function deleteProduct(id) {
  await api.delete(`/products/${id}`)
}