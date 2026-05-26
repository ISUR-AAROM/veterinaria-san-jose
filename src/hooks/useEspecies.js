import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useEspecies() {
  const [especies, setEspecies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('especie_mascota')
      .select('id, nombre')
      .then(({ data, error }) => {
        if (!error) setEspecies(data)
        setLoading(false)
      })
  }, [])

  return { especies, loading }
}
