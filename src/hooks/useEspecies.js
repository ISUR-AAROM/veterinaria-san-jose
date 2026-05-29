import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getCached, setCache } from '../lib/cache'

const CACHE_KEY = 'especies_activas'

export function useEspecies() {
  const [especies, setEspecies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadEspecies = async () => {
      const cached = getCached(CACHE_KEY)
      if (cached) {
        if (isMounted) {
          setEspecies(cached)
          setLoading(false)
        }
        return
      }

      const { data, error } = await supabase
        .from('especie_mascota')
        .select('id, nombre')

      if (!isMounted) return
      if (error) {
        setError(error.message)
      } else {
        setEspecies(data)
        setCache(CACHE_KEY, data)
      }
      setLoading(false)
    }

    loadEspecies()
    return () => { isMounted = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps — solo al montar

  return { especies, loading, error }
}
