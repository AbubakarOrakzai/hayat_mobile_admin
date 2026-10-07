import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiSmartphone } from 'react-icons/fi'
import './ProductManager.css'

const EMPTY = { brand: '', model: '', condition: 'new', category: 'phone', description: '', image: '', imageFile: null, specs: { ram: '', storage: '', color: '' } }
const BRANDS = ['Samsung', 'Apple', 'Xiaomi', 'Infinix', 'Tecno', 'Oppo', 'Vivo', 'Realme', 'Nokia', 'Huawei']
const MAX_IMAGE = 3 * 1024 * 1024

export default function ProductManager({ initial, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial, specs: { ...EMPTY.specs, ...initial?.specs } })
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const setSpec = (k) => (e) => setForm({ ...form, specs: { ...form.specs, [k]: e.target.value } })

  const pickImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_IMAGE) return toast.error('Image is too big. Use one under 3 MB.')
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result, imageFile: file }))
    reader.readAsDataURL(file)
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try { await onSubmit({ ...form, brand: form.brand.trim(), model: form.model.trim() }) }
    catch (err) { toast.error(err.message) }
    finally { setBusy(false) }
  }

  return (
    <form className="panel" onSubmit={submit}>
      <div className="form-grid">
        <div>
          <label className="label" htmlFor="pm-brand">Brand</label>
          <input id="pm-brand" className="input" list="pm-brands" required value={form.brand} onChange={set('brand')} />
          <datalist id="pm-brands">{BRANDS.map((b) => <option key={b} value={b} />)}</datalist>
        </div>
        <div>
          <label className="label" htmlFor="pm-model">Model</label>
          <input id="pm-model" className="input" required value={form.model} onChange={set('model')} placeholder="e.g. Galaxy A15" />
        </div>
        <div>
          <label className="label" htmlFor="pm-cond">Condition</label>
          <select id="pm-cond" className="input" value={form.condition} onChange={set('condition')}>
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="pm-cat">Category</label>
          <select id="pm-cat" className="input" value={form.category} onChange={set('category')}>
            <option value="phone">Phone</option>
            <option value="tablet">Tablet</option>
            <option value="watch">Smartwatch</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="pm-ram">RAM</label>
          <input id="pm-ram" className="input" value={form.specs.ram} onChange={setSpec('ram')} placeholder="e.g. 6 GB" />
        </div>
        <div>
          <label className="label" htmlFor="pm-storage">Storage</label>
          <input id="pm-storage" className="input" value={form.specs.storage} onChange={setSpec('storage')} placeholder="e.g. 128 GB" />
        </div>
        <div className="span-2">
          <label className="label" htmlFor="pm-color">Colour</label>
          <input id="pm-color" className="input" value={form.specs.color} onChange={setSpec('color')} />
        </div>
        <div className="span-2">
          <label className="label" htmlFor="pm-desc">Description (shown to customers)</label>
          <textarea id="pm-desc" className="input" rows={3} value={form.description} onChange={set('description')} />
        </div>

        <div className="span-2">
          <span className="label">Photo</span>
          <div className="pm-image">
            <div className="pm-image__preview">
              {form.image ? <img src={form.image} alt="Product preview" /> : <FiSmartphone size={32} />}
            </div>
            <div>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pickImage} />
              {form.image && (
                <button type="button" className="btn btn--ghost btn--sm pm-image__remove"
                  onClick={() => setForm({ ...form, image: '', imageFile: null })}>Remove photo</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn" disabled={busy}>{busy ? 'Saving…' : submitLabel}</button>
        {onCancel && <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}