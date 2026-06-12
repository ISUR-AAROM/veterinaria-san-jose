import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [personal, setPersonal] = useState(null)
  const [loading, setLoading] = useState(true)
  const isMounted = useRef(false)

  const fetchPersonal = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('personal')
      .select('id, rol, nombre')
      .eq('id_cuenta', userId)
      .maybeSingle()

    if (!isMounted.current) return
    if (error) {
      console.error('Error al obtener personal:', error.message)
    } else if (data) {
      setPersonal(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    isMounted.current = true
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!isMounted.current) return
      if (!session) {
        setLoading(false)
        return
      }
      await fetchPersonal(session.user.id)
    }

    loadSession()

    return () => {
      isMounted.current = false
    }
  }, [fetchPersonal])

  const setSessionPersonal = useCallback(async (userId) => {
    setLoading(true)
    await fetchPersonal(userId)
  }, [fetchPersonal])

  const clearPersonal = useCallback(() => {
    setPersonal(null)
  }, [])

  const value = useMemo(() => ({
    personal,
    loading,
    setSessionPersonal,
    clearPersonal,
  }), [personal, loading, setSessionPersonal, clearPersonal])

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
