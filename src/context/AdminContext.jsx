import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [personal, setPersonal] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setLoading(false)
        return
      }
      fetchPersonal(session.user.id)
    })
  }, [])

  async function fetchPersonal(userId) {
    const { data } = await supabase
      .from('personal')
      .select('id, rol, nombre')
      .eq('id_cuenta', userId)
      .single()

    if (data) setPersonal(data)
    setLoading(false)
  }

  async function setSessionPersonal(userId) {
    setLoading(true)
    await fetchPersonal(userId)
  }

  function clearPersonal() {
    setPersonal(null)
  }

  return (
    <AdminContext.Provider value={{ personal, loading, setSessionPersonal, clearPersonal }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
