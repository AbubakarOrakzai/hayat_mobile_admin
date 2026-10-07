import { useEffect, useState } from 'react'
import { formatPrice, formatDateTime } from '../utils/format'
import './PaymentModal.css'

export default function PaymentModal({ title, subtitle, total, paid, history = [], onClose, onSubmit }) {
  const remaining = total - paid
  const [amount, setAmount] = useState(String(remaining))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = async (e) => {
    e.preventDefault()
    const n = Number(amount)
    if (!(n > 0)) return setError('Enter an amount greater than zero.')
    if (n > remaining) return setError(`The most you can record is ${formatPrice(remaining)}.`)
    setBusy(true)
    setError('')
    try { await onSubmit(n) }
    catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }

  return (
    <div className="modal" onClick={onClose}>
      <form className="modal__box" role="dialog" aria-modal="true" aria-label={title}
        onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2 className="modal__title">{title}</h2>
        {subtitle && <p className="muted">{subtitle}</p>}

        <dl className="modal__sums">
          <div><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          <div><dt>Received</dt><dd className="good">{formatPrice(paid)}</dd></div>
          <div><dt>Balance</dt><dd className="bad">{formatPrice(remaining)}</dd></div>
        </dl>

        <label className="label" htmlFor="pay-amount">Amount received now</label>
        <input id="pay-amount" className="input" type="number" min="1" max={remaining}
          value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
        {error && <p className="bad small modal__error" role="alert">{error}</p>}

        {history.length > 0 && (
          <div className="modal__history">
            <p className="small muted">Earlier payments</p>
            <ul>
              {history.map((h, i) => (
                <li key={i}><span>{formatDateTime(h.date)}</span><strong>{formatPrice(h.amount)}</strong></li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-actions">
          <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Record payment'}</button>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}