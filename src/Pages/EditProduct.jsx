import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import ProductManager from '../Components/ProductManager'
import { getProduct, updateProduct } from '../services/productService'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(undefined) // undefined = loading, null = not found

  useEffect(() => {
    getProduct(id).then(setProduct)
  }, [id])

  const save = async (data) => {
    await updateProduct(id, data)
    toast.success('Product updated')
    navigate('/products')
  }

  if (product === undefined) return <p className="empty">Loading…</p>
  if (product === null) return <p className="empty">Product not found.</p>

  return (
    <>
      <div className="page-head">
        <div><h1>Edit {product.brand} {product.model}</h1></div>
      </div>
      <ProductManager initial={product} submitLabel="Save changes" onSubmit={save} onCancel={() => navigate('/products')} />
    </>
  )
}