import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const SessionContext = createContext(null)

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return
      setSession(session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return
      setSession(session)
    })

    return () => {
      cancelled = true
      listener?.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[#7A6555]">
        Cargando...
      </div>
    )
  }

  return (
    <SessionContext.Provider value={{ session, loading: false }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSessionContext() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSessionContext must be used within SessionProvider')
  return ctx
}
