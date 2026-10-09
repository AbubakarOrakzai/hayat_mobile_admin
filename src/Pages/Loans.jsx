import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiPlus } from 'react-icons/fi'
import StatusBadge from '../components/StatusBadge'
import PaymentModal from '../components/PaymentModal'
import MetricCard from '../components/MetricCard'
import { getLoans, addLoan, recordRepayment } from '../services/loanService'
import { formatPrice, formatDate } from '../utils/format'

const FILTERS = [['open', 'To receive'], ['paid', 'Paid back'], ['all', 'All']]
const EMPTY = { personName: '', phone: '', amount: '', dueDate: '', notes: '' }

export default function Loans() {
  const [loans, setLoans] = useState(null)
  const [filter, setFilter] = useState('open')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [paying, setPaying] = useState(null)

  const load = useCallback(async () => {
    setLoans(await getLoans())
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const all = loans || []
  const list = all.filter((l) => filter === 'all' || (filter === 'paid' ? l.status === 'paid' : l.status !== 'paid'))
  const open = all.filter((l) => l.status !== 'paid')
  const toReceive = open.reduce((t, l) => t + (l.amount - l.amountReceived), 0)
  const today = new Date().toISOString().slice(0, 10)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await addLoan(form)
      toast.success('Loan saved')
      setForm(EMPTY)
      setShowForm(false)
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  const repay = async (amount) => {
    await recordRepayment(paying._id, amount)
    toast.success('Repayment recorded')
    setPaying(null)
    load()
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Loans</h1>
          <p className="muted">Money you gave out. Paid loans stay in the list as a record.</p>
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)}><FiPlus /> {showForm ? 'Close form' : 'New loan'}</button>
      </div>

      {showForm && (
        <form className="panel" onSubmit={submit}>
          <h2 className="panel__title">New loan</h2>
          <div className="form-grid">
            <div>
              <label className="label" htmlFor="ln-name">Person&apos;s name</label>
              <input id="ln-name" className="input" required value={form.personName} onChange={set('personName')} />
            </div>
            <div>
              <label className="label" htmlFor="ln-phone">Phone</label>
              <input id="ln-phone" className="input" type="tel" value={form.phone} onChange={set('phone')} />
            </div>
            <div>
              <label className="label" htmlFor="ln-amount">Amount given</label>
              <input id="ln-amount" className="input" type="number" min="1" required value={form.amount} onChange={set('amount')} />
            </div>
            <div>
              <label className="label" htmlFor="ln-due">Expected back by</label>
              <input id="ln-due" className="input" type="date" value={form.dueDate} onChange={set('dueDate')} />
            </div>
            <div className="span-2">
              <label className="label" htmlFor="ln-notes">Notes</label>
              <textarea id="ln-notes" className="input" rows={2} value={form.notes} onChange={set('notes')} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save loan'}</button>
          </div>
        </form>
      )}

      <div className="dash-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <MetricCard label="Money to receive" value={formatPrice(toReceive)} hint={`${open.length} open loans`} tone="warn" />
        <MetricCard label="Paid back" value={all.length - open.length} hint="loans fully received" />
      </div>

      <div className="toolbar">
        <div className="chips">
          {FILTERS.map(([key, label]) => (
            <button key={key} className={filter === key ? 'chip active' : 'chip'} onClick={() => setFilter(key)}>{label}</button>
          ))}
        </div>
      </div>

      {!loans ? <p className="empty">Loading…</p> : list.length === 0 ? <p className="empty">No loans here.</p> : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Person</th><th>Given</th><th className="num">Amount</th><th className="num">Received</th><th className="num">Balance</th><th>Due</th><th>Status</th><th /></tr>
            </thead>
            <tbody>
              {list.map((l) => {
                const balance = l.amount - l.amountReceived
                const overdue = l.status !== 'paid' && l.dueDate && l.dueDate < today
                return (
                  <tr key={l._id}>
                    <td>
                      <strong>{l.personName}</strong>
                      {l.phone && <div className="small muted">{l.phone}</div>}
                      {l.notes && <div className="small muted">{l.notes}</div>}
                    </td>
                    <td>{formatDate(l.createdAt)}</td>
                    <td className="num">{formatPrice(l.amount)}</td>
                    <td className="num good">{formatPrice(l.amountReceived)}</td>
                    <td className={balance > 0 ? 'num bad' : 'num'}>{formatPrice(balance)}</td>
                    <td>
                      {l.dueDate ? formatDate(l.dueDate) : '—'}
                      {overdue && <div className="small bad"><strong>Overdue</strong></div>}
                    </td>
                    <td><StatusBadge status={l.status} /></td>
                    <td className="actions">
                      {balance > 0 && <button className="btn btn--sm" onClick={() => setPaying(l)}>Add repayment</button>}
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
          title={`Repayment from ${paying.personName}`}
          total={paying.amount} paid={paying.amountReceived} history={paying.payments}
          onClose={() => setPaying(null)} onSubmit={repay}
        />
      )}
    </>
  )
}