import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useRazas(idEspecie) {
  const [razas, setRazas] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    if (!idEspecie) {
      setRazas([])
      setLoading(false)
      return
    }
    setLoading(true)
    const loadRazas = async () => {
      const { data, error } = await supabase
        .from('raza')
        .select('id, nombre')
        .eq('id_especie', idEspecie)

      if (!isMounted) return
      if (!error) setRazas(data)
      setLoading(false)
    }

    loadRazas()

    return () => {
      isMounted = false
    }
  }, [idEspecie])

  return { razas, loading }
}
