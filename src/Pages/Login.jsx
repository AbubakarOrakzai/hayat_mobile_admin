import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { FiSmartphone } from 'react-icons/fi'
import { useAdmin } from '../context/AdminContext'
import Credits from '../Components/Credits'
import { SHOP } from '../config'
import './Login.css'

export default function Login() {
  const { session, loading, login } = useAdmin()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // A message left by the API layer, e.g. "Your session has expired."
  useEffect(() => {
    const notice = sessionStorage.getItem('auth-notice')
    if (notice) {
      setError(notice)
      sessionStorage.removeItem('auth-notice')
    }
  }, [])

  if (loading) return <p className="empty">Loading…</p>
  if (session) return <Navigate to={location.state?.from?.pathname || '/'} replace />

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(email.trim(), password)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="login">
      <form className="login__card" onSubmit={submit}>
        <span className="login__logo"><FiSmartphone size={22} /></span>
        <h1 className="login__title">{SHOP.name}</h1>
        <p className="muted">Sign in to the admin panel</p>

        <label className="label" htmlFor="login-email">Email</label>
        <input id="login-email" className="input" type="email" autoComplete="username" required autoFocus
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="label login__gap" htmlFor="login-password">Password</label>
        <input id="login-password" className="input" type="password" autoComplete="current-password" required
          value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p className="bad small login__error" role="alert">{error}</p>}

        <button className="btn login__btn" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>

      <Credits variant="light" />
    </div>
  )
}