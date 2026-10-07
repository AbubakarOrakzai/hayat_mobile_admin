import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FiCamera, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { isValidImei } from '../utils/imei'
import './ImeiScanner.css'

/*
  Works with:
  1. A USB / Bluetooth barcode scanner: it types the digits and presses Enter.
  2. Typing the IMEI by hand.
  3. The phone / laptop camera (needs https or localhost).
  Props:
    value, onChange(imei)  - controlled value
    onSubmit(imei)         - called with a valid IMEI on Enter or after a camera scan
    focusSignal            - change this number to move focus back into the field
*/
export default function ImeiScanner({ value, onChange, onSubmit, focusSignal = 0, submitLabel = 'Use IMEI' }) {
  const inputRef = useRef(null)
  const [camera, setCamera] = useState(false)
  const callbacks = useRef({})
  callbacks.current = { onChange, onSubmit }

  useEffect(() => {
    inputRef.current?.focus()
  }, [focusSignal])

  useEffect(() => {
    if (!camera) return
    let scanner = null
    let cancelled = false

    import('html5-qrcode').then(({ Html5Qrcode }) => {
      if (cancelled) return
      scanner = new Html5Qrcode('imei-reader')
      scanner
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 260, height: 120 } },
          (text) => {
            const digits = text.replace(/\D/g, '')
            if (!/^\d{15}$/.test(digits)) return // keep scanning until we read a 15-digit code
            setCamera(false)
            callbacks.current.onChange(digits)
            callbacks.current.onSubmit?.(digits)
          },
          () => {}
        )
        .catch(() => {
          setCamera(false)
          toast.error('Could not open the camera. Allow camera access and use https or localhost.')
        })
    })

    return () => {
      cancelled = true
      if (scanner) {
        try { scanner.stop().then(() => scanner.clear()).catch(() => {}) } catch { /* not running */ }
      }
    }
  }, [camera])

  const digits = value.length
  const valid = isValidImei(value)
  const bad = digits === 15 && !valid

  const handleKey = (e) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    if (valid) onSubmit?.(value)
    else toast.error('The IMEI must be 15 digits and pass the checksum.')
  }

  return (
    <div className="scanner">
      <label className="label" htmlFor="imei-input">IMEI</label>
      <div className="scanner__row">
        <input
          id="imei-input" ref={inputRef} className={`input mono scanner__input${bad ? ' scanner__input--bad' : ''}`}
          inputMode="numeric" autoComplete="off" placeholder="Scan or type 15 digits" value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 15))} onKeyDown={handleKey}
        />
        <button type="button" className="btn btn--ghost scanner__cam" onClick={() => setCamera(!camera)}>
          {camera ? <><FiX /> Close</> : <><FiCamera /> Camera</>}
        </button>
        {onSubmit && (
          <button type="button" className="btn" disabled={!valid} onClick={() => onSubmit(value)}>{submitLabel}</button>
        )}
      </div>

      <p className={`scanner__hint small ${valid ? 'good' : bad ? 'bad' : 'muted'}`}>
        {valid ? <><FiCheckCircle /> Valid IMEI</>
          : bad ? <><FiAlertCircle /> Checksum failed. Check the number.</>
          : `${digits}/15 digits. Click the field and scan with the scanner.`}
      </p>

      {camera && <div id="imei-reader" className="scanner__reader" />}
    </div>
  )
}