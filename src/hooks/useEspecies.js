import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useEspecies() {
  const [especies, setEspecies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadEspecies = async () => {
      const { data, error } = await supabase
        .from('especie_mascota')
        .select('id, nombre')

      if (!isMounted) return
      if (!error) setEspecies(data)
      setLoading(false)
    }

    loadEspecies()

    return () => {
      isMounted = false
    }
  }, [])

  return { especies, loading }
}
