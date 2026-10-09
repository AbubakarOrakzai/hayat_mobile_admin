import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiPlus } from 'react-icons/fi'
import { getProducts, deleteProduct } from '../services/productService'

export default function ProductList() {
  const [products, setProducts] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [q, setQ] = useState('')

  const load = useCallback(async () => {
    try {
      setProducts(await getProducts())
      setLoadError('')
    } catch (err) {
      setLoadError(err.message)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const remove = async (p) => {
    if (!window.confirm(`Delete ${p.brand} ${p.model}?`)) return
    try { await deleteProduct(p._id); toast.success('Product deleted'); load() }
    catch (err) { toast.error(err.message) }
  }

  const list = (products || []).filter((p) => `${p.brand} ${p.model}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Products</h1>
          <p className="muted">The models customers see on the website. Each phone you add to stock belongs to one of these.</p>
        </div>
        <Link to="/products/add" className="btn"><FiPlus /> Add product</Link>
      </div>

      <div className="toolbar">
        <input className="input" placeholder="Search brand or model" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
      </div>

      {loadError ? <p className="empty"><span className="bad">{loadError}</span></p> : !products ? <p className="empty">Loading…</p> : list.length === 0 ? <p className="empty">No products found.</p> : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Product</th><th>Condition</th><th>Specs</th><th className="num">In stock</th><th className="num">Total added</th><th /></tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p._id}>
                  <td><strong>{p.brand} {p.model}</strong></td>
                  <td>{p.condition === 'new' ? 'New' : 'Used'}</td>
                  <td className="muted">{[p.specs.ram, p.specs.storage, p.specs.color].filter(Boolean).join(' · ') || '—'}</td>
                  <td className="num">{p.stock}</td>
                  <td className="num">{p.total}</td>
                  <td className="actions">
                    <Link to={`/products/${p._id}/edit`} className="btn btn--ghost btn--sm">Edit</Link>
                    <button className="btn btn--danger btn--sm" onClick={() => remove(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}