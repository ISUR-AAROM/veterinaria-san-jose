import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useRazas(idEspecie) {
  const [razas, setRazas] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!idEspecie) {
      setRazas([])
      return
    }
    setLoading(true)
    supabase
      .from('raza')
      .select('id, nombre')
      .eq('id_especie', idEspecie)
      .then(({ data, error }) => {
        if (!error) setRazas(data)
        setLoading(false)
      })
  }, [idEspecie])

  return { razas, loading }
}
