import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getMessages, deleteMessage } from '../services/messageService'
import { formatDateTime } from '../utils/format'

export default function Messages() {
  const [messages, setMessages] = useState(null)
  const [loadError, setLoadError] = useState('')

  const load = useCallback(async () => {
    try {
      setMessages(await getMessages())
      setLoadError('')
    } catch (err) {
      setLoadError(err.message)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const remove = async (m) => {
    if (!window.confirm(`Delete the message from ${m.name}?`)) return
    try { await deleteMessage(m._id); toast.success('Message deleted'); load() }
    catch (err) { toast.error(err.message) }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Messages</h1>
          <p className="muted">Messages sent from the Contact page on the website.</p>
        </div>
      </div>

      {loadError ? <p className="empty"><span className="bad">{loadError}</span></p> : !messages ? <p className="empty">Loading…</p> : messages.length === 0 ? <p className="empty">No messages yet.</p> : (
        <div style={{ display: 'grid', gap: 12 }}>
          {messages.map((m) => (
            <article key={m._id} className="panel" style={{ margin: 0 }}>
              <div className="row">
                <strong>{m.name}</strong>
                <a href={`tel:${m.phone}`} className="good small"><strong>{m.phone}</strong></a>
                <span className="spacer" />
                <span className="small muted">{formatDateTime(m.date)}</span>
              </div>
              <p style={{ marginTop: 10 }}>{m.message}</p>
              <div className="form-actions" style={{ marginTop: 14 }}>
                <a className="btn btn--sm" href={`tel:${m.phone}`}>Call back</a>
                <button className="btn btn--danger btn--sm" onClick={() => remove(m)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}