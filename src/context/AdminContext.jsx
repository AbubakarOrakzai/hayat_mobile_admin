import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supbase'

const AdminContext = createContext(null)
export const useAdmin = () => useContext(AdminContext)

export default function AdminProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    if (!supabaseConfigured) {
      throw new Error('Login is not configured: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are missing from this build.')
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      throw new Error(error.message === 'Invalid login credentials' ? 'Wrong email or password.' : error.message)
    }
  }

  const logout = () => supabase.auth.signOut()

  return (
    <AdminContext.Provider value={{ session, user: session?.user, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}