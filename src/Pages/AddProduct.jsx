import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ProductManager from '../components/ProductManager'
import { addProduct } from '../services/productService'

export default function AddProduct() {
  const navigate = useNavigate()

  const save = async (data) => {
    await addProduct(data)
    toast.success('Product added')
    navigate('/products')
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Add product</h1>
          <p className="muted">Create the model first, then add each phone to stock by IMEI.</p>
        </div>
      </div>
      <ProductManager submitLabel="Save product" onSubmit={save} onCancel={() => navigate('/products')} />
    </>
  )
}