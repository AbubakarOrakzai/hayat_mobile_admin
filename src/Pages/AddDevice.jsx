import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import ImeiScanner from '../Components/ImeiScanner'
import { getProducts } from '../services/productService'
import { addDevice } from '../services/deviceService'
import { isValidImei } from '../utils/imei'
import { formatPrice } from '../utils/format'

export default function AddDevice() {
  const [products, setProducts] = useState([])
  const [productId, setProductId] = useState('')
  const [imei, setImei] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [busy, setBusy] = useState(false)
  const [focus, setFocus] = useState(0)
  const [added, setAdded] = useState([])

  useEffect(() => {
    getProducts().then(setProducts).catch((err) => toast.error(err.message))
  }, [])

  const save = async () => {
    if (!productId) return toast.error('Choose the phone model first.')
    if (!isValidImei(imei)) return toast.error('Scan or type a valid 15-digit IMEI.')
    if (!(Number(costPrice) > 0) || !(Number(salePrice) > 0)) return toast.error('Enter the cost price and the sale price.')

    setBusy(true)
    try {
      const device = await addDevice({ imei, productId, costPrice, salePrice })
      setAdded((list) => [device, ...list])
      toast.success(`${device.productName} added`)
      setImei('')          // keep model and prices so the next phone is one scan away
      setFocus((n) => n + 1)
    } catch (err) {
      toast.error(err.message)
      setFocus((n) => n + 1)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Add device</h1>
          <p className="muted">Pick the model, set the prices, then scan each phone. The model and prices stay filled, so adding 5 of the same phone takes 5 scans.</p>
        </div>
      </div>

      <section className="panel">
        <div className="form-grid">
          <div className="span-2">
            <label className="label" htmlFor="ad-product">Phone model</label>
            <select id="ad-product" className="input" value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="">Choose a model…</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.brand} {p.model} · {p.condition === 'new' ? 'New' : 'Used'}{p.specs.storage ? ` · ${p.specs.storage}` : ''}
                </option>
              ))}
            </select>
            <p className="small muted" style={{ marginTop: 6 }}>
              Model not in the list? <Link to="/products/add" className="good"><strong>Add the product first</strong></Link>.
            </p>
          </div>

          <div>
            <label className="label" htmlFor="ad-cost">Cost price (what you paid)</label>
            <input id="ad-cost" className="input" type="number" min="0" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="ad-sale">Sale price (what the customer pays)</label>
            <input id="ad-sale" className="input" type="number" min="0" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
          </div>

          <div className="span-2">
            <ImeiScanner value={imei} onChange={setImei} onSubmit={save} focusSignal={focus} submitLabel={busy ? 'Saving…' : 'Add to stock'} />
          </div>
        </div>
      </section>

      {added.length > 0 && (
        <section className="panel">
          <h2 className="panel__title">Added in this session ({added.length})</h2>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>IMEI</th><th>Phone</th><th className="num">Cost</th><th className="num">Sale price</th></tr></thead>
              <tbody>
                {added.map((d) => (
                  <tr key={d._id}>
                    <td className="mono">{d.imei}</td>
                    <td>{d.productName}</td>
                    <td className="num">{formatPrice(d.costPrice)}</td>
                    <td className="num">{formatPrice(d.salePrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  )
}