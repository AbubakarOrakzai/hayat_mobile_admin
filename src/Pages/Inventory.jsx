import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiPlus } from 'react-icons/fi'
import StatusBadge from '../components/StatusBadge'
import { getDevices, deleteDevice } from '../services/deviceService'
import { formatPrice, formatDate } from '../utils/format'

const FILTERS = [['all', 'All'], ['in_stock', 'In stock'], ['sold', 'Sold']]

export default function Inventory() {
  const [devices, setDevices] = useState(null)
  const [filter, setFilter] = useState('in_stock')
  const [q, setQ] = useState('')

  const load = useCallback(async () => {
    setDevices(await getDevices())
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const remove = async (d) => {
    if (!window.confirm(`Remove ${d.productName} (${d.imei}) from stock?`)) return
    try { await deleteDevice(d._id); toast.success('Device removed'); load() }
    catch (err) { toast.error(err.message) }
  }

  const all = devices || []
  const term = q.trim().toLowerCase()
  const list = all.filter((d) =>
    (filter === 'all' || d.status === filter) &&
    (!term || d.imei.includes(term) || d.productName.toLowerCase().includes(term))
  )
  const stock = all.filter((d) => d.status === 'in_stock')
  const stockValue = stock.reduce((t, d) => t + d.costPrice, 0)

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Inventory</h1>
          <p className="muted">{stock.length} phones in stock, cost value {formatPrice(stockValue)}</p>
        </div>
        <Link to="/inventory/add" className="btn"><FiPlus /> Add device</Link>
      </div>

      <div className="toolbar">
        <input className="input" placeholder="Search by IMEI or model" value={q}
          onChange={(e) => setQ(e.target.value)} aria-label="Search devices" inputMode="search" />
        <div className="chips">
          {FILTERS.map(([key, label]) => (
            <button key={key} className={filter === key ? 'chip active' : 'chip'} onClick={() => setFilter(key)}>{label}</button>
          ))}
        </div>
      </div>

      {!devices ? <p className="empty">Loading…</p> : list.length === 0 ? <p className="empty">No devices found.</p> : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>IMEI</th><th>Phone</th><th className="num">Cost</th><th className="num">Sale price</th><th>Added</th><th>Status</th><th /></tr>
            </thead>
            <tbody>
              {list.map((d) => (
                <tr key={d._id}>
                  <td className="mono">{d.imei}</td>
                  <td>
                    <strong>{d.productName}</strong>
                    <div className="small muted">{[d.specs?.ram, d.specs?.storage, d.specs?.color].filter(Boolean).join(' · ')}</div>
                  </td>
                  <td className="num">{formatPrice(d.costPrice)}</td>
                  <td className="num">{formatPrice(d.salePrice)}</td>
                  <td>{formatDate(d.addedAt)}</td>
                  <td><StatusBadge status={d.status} /></td>
                  <td className="actions">
                    {d.status === 'in_stock' && <button className="btn btn--danger btn--sm" onClick={() => remove(d)}>Remove</button>}
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