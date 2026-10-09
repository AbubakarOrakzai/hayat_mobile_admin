import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import ImeiScanner from '../components/ImeiScanner'
import StatusBadge from '../components/StatusBadge'
import { getDeviceByImei } from '../services/deviceService'
import { createSale } from '../services/saleService'
import { formatPrice, formatDateTime } from '../utils/format'
import './NewSale.css'

const PAY_TYPES = [['paid', 'Paid in full'], ['partial', 'Part payment'], ['pending', 'Pay later']]

export default function NewSale() {
  const [imei, setImei] = useState('')
  const [device, setDevice] = useState(null)
  const [form, setForm] = useState({ salePrice: '', customerName: '', customerPhone: '' })
  const [payType, setPayType] = useState('paid')
  const [partial, setPartial] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(null)
  const [focus, setFocus] = useState(0)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const price = Number(form.salePrice) || 0
  const paidNow = payType === 'paid' ? price : payType === 'pending' ? 0 : Number(partial) || 0

  const lookup = async (value) => {
    const found = await getDeviceByImei(value)
    if (!found) return toast.error('This IMEI is not in the system. Add it in Inventory first.')
    if (found.status === 'sold') return toast.error('This phone is already sold.')
    setDevice(found)
    setForm((f) => ({ ...f, salePrice: String(found.salePrice) }))
  }

  const reset = () => {
    setImei(''); setDevice(null); setDone(null); setPartial(''); setPayType('paid')
    setForm({ salePrice: '', customerName: '', customerPhone: '' })
    setFocus((n) => n + 1)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!(price > 0)) return toast.error('Enter the sale price.')
    if (payType === 'partial' && !(paidNow > 0 && paidNow < price)) return toast.error('For a part payment, enter an amount between 1 and the sale price.')
    setBusy(true)
    try {
      const sale = await createSale({ imei: device.imei, salePrice: price, customerName: form.customerName, customerPhone: form.customerPhone, amountPaid: paidNow })
      setDone(sale)
      toast.success('Sale saved')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <>
        <div className="page-head"><div><h1>Sale saved</h1></div></div>
        <section className="panel invoice">
          <div className="row">
            <h2 className="panel__title">{done.invoiceNo}</h2>
            <span className="spacer" />
            <StatusBadge status={done.paymentStatus} />
          </div>
          <dl className="invoice__grid">
            <div><dt>Phone</dt><dd>{done.productName}</dd></div>
            <div><dt>IMEI</dt><dd className="mono">{done.imei}</dd></div>
            <div><dt>Customer</dt><dd>{done.customerName || 'Walk-in customer'}</dd></div>
            <div><dt>Phone number</dt><dd>{done.customerPhone || '—'}</dd></div>
            <div><dt>Date</dt><dd>{formatDateTime(done.soldAt)}</dd></div>
            <div><dt>Total</dt><dd>{formatPrice(done.salePrice)}</dd></div>
            <div><dt>Received</dt><dd className="good">{formatPrice(done.amountPaid)}</dd></div>
            <div><dt>Balance</dt><dd className={done.salePrice > done.amountPaid ? 'bad' : ''}>{formatPrice(done.salePrice - done.amountPaid)}</dd></div>
          </dl>
          <div className="form-actions no-print">
            <button className="btn" onClick={reset}>Next sale</button>
            <button className="btn btn--ghost" onClick={() => window.print()}>Print</button>
            <Link to="/sales" className="btn btn--ghost">All bills</Link>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>New sale</h1>
          <p className="muted">Scan the phone being sold. The price fills in automatically.</p>
        </div>
      </div>

      <section className="panel">
        <ImeiScanner value={imei} onChange={(v) => { setImei(v); if (device) setDevice(null) }}
          onSubmit={lookup} focusSignal={focus} submitLabel="Find phone" />
      </section>

      {device && (
        <form className="panel" onSubmit={submit}>
          <div className="sale-device">
            <div>
              <p className="sale-device__name">{device.productName}</p>
              <p className="muted small">{[device.specs?.ram, device.specs?.storage, device.specs?.color].filter(Boolean).join(' · ')}</p>
            </div>
            <p className="small muted">
              Cost {formatPrice(device.costPrice)} · Profit at this price{' '}
              <strong className={price - device.costPrice >= 0 ? 'good' : 'bad'}>{formatPrice(price - device.costPrice)}</strong>
            </p>
          </div>

          <div className="form-grid">
            <div>
              <label className="label" htmlFor="ns-price">Sale price</label>
              <input id="ns-price" className="input" type="number" min="0" value={form.salePrice} onChange={set('salePrice')} required />
            </div>
            <div />
            <div>
              <label className="label" htmlFor="ns-name">Customer name</label>
              <input id="ns-name" className="input" value={form.customerName} onChange={set('customerName')} placeholder="Optional" />
            </div>
            <div>
              <label className="label" htmlFor="ns-phone">Customer phone</label>
              <input id="ns-phone" className="input" type="tel" value={form.customerPhone} onChange={set('customerPhone')} placeholder="Needed if paying later" required={payType !== 'paid'} />
            </div>

            <div className="span-2">
              <span className="label">Payment</span>
              <div className="chips">
                {PAY_TYPES.map(([key, label]) => (
                  <button type="button" key={key} className={payType === key ? 'chip active' : 'chip'} onClick={() => setPayType(key)}>{label}</button>
                ))}
              </div>
            </div>

            {payType === 'partial' && (
              <div>
                <label className="label" htmlFor="ns-partial">Amount received now</label>
                <input id="ns-partial" className="input" type="number" min="1" value={partial} onChange={(e) => setPartial(e.target.value)} />
              </div>
            )}
          </div>

          <p className="sale-summary">
            Received now <strong>{formatPrice(paidNow)}</strong> · Balance <strong className={price - paidNow > 0 ? 'bad' : 'good'}>{formatPrice(Math.max(price - paidNow, 0))}</strong>
          </p>

          <div className="form-actions">
            <button className="btn btn--tag" disabled={busy}>{busy ? 'Saving…' : 'Save sale'}</button>
            <button type="button" className="btn btn--ghost" onClick={reset}>Cancel</button>
          </div>
        </form>
      )}
    </>
  )
}