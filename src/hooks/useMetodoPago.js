import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useMetodoPago() {
  const [metodos, setMetodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    const cargar = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('metodo_pago')
        .select('id, nombre')
        .eq('is_active', true)
        .order('nombre')
      if (!isMounted) return
      if (error) setError(error.message)
      else if (data) setMetodos(data)
      setLoading(false)
    }
    cargar()
    return () => { isMounted = false }
  }, [])

  return { metodos, loading, error }
}
