import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useSession() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!isMounted) return
      setSession(session)
      setLoading(false)
    }

    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return
      setSession(session)
    })

    return () => {
      isMounted = false
      listener?.subscription.unsubscribe()
    }
  }, [])

  return { session, loading }
}
