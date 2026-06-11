import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useMetodoPago() {
  const [metodos, setMetodos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const cargar = async () => {
      const { data } = await supabase
        .from('metodo_pago')
        .select('id, nombre')
        .eq('is_active', true)
        .order('nombre')
      if (isMounted && data) setMetodos(data)
      if (isMounted) setLoading(false)
    }
    cargar()
    return () => { isMounted = false }
  }, [])

  return { metodos, loading }
}
