import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import StatusBadge from '../Components/StatusBadge'
import PaymentModal from '../Components/PaymentModal'
import MetricCard from '../Components/MetricCard'
import { getSales, recordPayment } from '../services/saleService'
import { formatPrice, formatDate } from '../utils/format'

const FILTERS = [['all', 'All'], ['pending', 'Pending'], ['partial', 'Part paid'], ['paid', 'Paid']]

export default function Sales() {
  const [sales, setSales] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')
  const [paying, setPaying] = useState(null)

  const load = useCallback(async () => {
    try {
      setSales(await getSales())
      setLoadError('')
    } catch (err) {
      setLoadError(err.message)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const all = sales || []
  const term = q.trim().toLowerCase()
  const list = all.filter((s) =>
    (filter === 'all' || s.paymentStatus === filter) &&
    (!term || [s.invoiceNo, s.customerName, s.customerPhone, s.imei, s.productName].some((v) => v.toLowerCase().includes(term)))
  )
  const toCollect = all.reduce((t, s) => t + (s.salePrice - s.amountPaid), 0)
  const unpaid = all.filter((s) => s.amountPaid < s.salePrice).length

  const pay = async (amount) => {
    await recordPayment(paying._id, amount)
    toast.success('Payment recorded')
    setPaying(null)
    load()
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Sales and bills</h1>
          <p className="muted">Every sale is a bill. Record payments here when customers pay later.</p>
        </div>
        <Link to="/new-sale" className="btn btn--tag">New sale</Link>
      </div>

      <div className="dash-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <MetricCard label="Total bills" value={all.length} />
        <MetricCard label="Money to collect" value={formatPrice(toCollect)} hint={`${unpaid} unpaid or part paid`} tone="warn" />
      </div>

      <div className="toolbar">
        <input className="input" placeholder="Search invoice, customer, IMEI or phone" value={q}
          onChange={(e) => setQ(e.target.value)} aria-label="Search bills" />
        <div className="chips">
          {FILTERS.map(([key, label]) => (
            <button key={key} className={filter === key ? 'chip active' : 'chip'} onClick={() => setFilter(key)}>{label}</button>
          ))}
        </div>
      </div>

      {loadError ? <p className="empty"><span className="bad">{loadError}</span></p> : !sales ? <p className="empty">Loading…</p> : list.length === 0 ? <p className="empty">No bills found.</p> : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Phone</th><th className="num">Total</th><th className="num">Received</th><th className="num">Balance</th><th>Status</th><th /></tr>
            </thead>
            <tbody>
              {list.map((s) => {
                const balance = s.salePrice - s.amountPaid
                return (
                  <tr key={s._id}>
                    <td className="mono">{s.invoiceNo}</td>
                    <td>{formatDate(s.soldAt)}</td>
                    <td>
                      {s.customerName || <span className="muted">Walk-in</span>}
                      {s.customerPhone && <div className="small muted">{s.customerPhone}</div>}
                    </td>
                    <td>
                      <strong>{s.productName}</strong>
                      <div className="small muted mono">{s.imei}</div>
                    </td>
                    <td className="num">{formatPrice(s.salePrice)}</td>
                    <td className="num good">{formatPrice(s.amountPaid)}</td>
                    <td className={balance > 0 ? 'num bad' : 'num'}>{formatPrice(balance)}</td>
                    <td><StatusBadge status={s.paymentStatus} /></td>
                    <td className="actions">
                      {balance > 0 && <button className="btn btn--sm" onClick={() => setPaying(s)}>Add payment</button>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {paying && (
        <PaymentModal
          title={`Payment for ${paying.invoiceNo}`}
          subtitle={`${paying.customerName || 'Walk-in customer'} · ${paying.productName}`}
          total={paying.salePrice} paid={paying.amountPaid} history={paying.payments}
          onClose={() => setPaying(null)} onSubmit={pay}
        />
      )}
    </>
  )
}