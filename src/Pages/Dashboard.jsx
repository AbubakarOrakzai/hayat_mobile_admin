import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts'
import MetricCard from '../components/MetricCard'
import StatusBadge from '../components/StatusBadge'
import { getStats } from '../services/dashboardService'
import { formatPrice, formatDate } from '../utils/format'
import './Dashboard.css'

export default function Dashboard() {
  const [s, setS] = useState(null)

  useEffect(() => {
    getStats().then(setS)
  }, [])

  if (!s) return <p className="empty">Loading…</p>

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Sales, profit and money still to collect.</p>
        </div>
        <Link to="/new-sale" className="btn btn--tag">New sale</Link>
      </div>

      <div className="dash-grid">
        <MetricCard label="Sales today" value={s.today.count} hint={formatPrice(s.today.revenue)} />
        <MetricCard label="Profit today" value={formatPrice(s.today.profit)} tone="good" />
        <MetricCard label="Last 7 days sales" value={formatPrice(s.week.revenue)} hint={`${s.week.count} phones sold`} />
        <MetricCard label="Last 7 days profit" value={formatPrice(s.week.profit)} tone="good" />
        <MetricCard label="Bills to collect" value={formatPrice(s.pendingBills.amount)} hint={`${s.pendingBills.count} unpaid or part paid`} tone="warn" />
        <MetricCard label="Loans to receive" value={formatPrice(s.loans.amount)} hint={`${s.loans.count} open loans`} tone="warn" />
        <MetricCard label="Phones in stock" value={s.stock.count} hint={`Cost value ${formatPrice(s.stock.value)}`} />
      </div>

      <section className="panel dash-chart">
        <h2 className="panel__title">Last 7 days</h2>
        <div className="dash-chart__box">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={s.days} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e8e1" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={56} tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
              <Tooltip formatter={(v) => formatPrice(v)} />
              <Legend />
              <Bar dataKey="revenue" name="Sales" fill="#1d5b3f" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit" name="Profit" fill="#ffd23f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <div className="row">
          <h2 className="panel__title">Bills waiting for payment</h2>
          <span className="spacer" />
          <Link to="/sales" className="small dash-link">See all bills</Link>
        </div>
        {s.recentPending.length === 0 ? (
          <p className="muted">Every bill is paid.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Invoice</th><th>Customer</th><th>Phone</th><th>Date</th><th className="num">Balance</th><th>Status</th></tr></thead>
              <tbody>
                {s.recentPending.map((x) => (
                  <tr key={x._id}>
                    <td className="mono">{x.invoiceNo}</td>
                    <td>{x.customerName}</td>
                    <td>{x.productName}</td>
                    <td>{formatDate(x.soldAt)}</td>
                    <td className="num bad"><strong>{formatPrice(x.salePrice - x.amountPaid)}</strong></td>
                    <td><StatusBadge status={x.paymentStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}