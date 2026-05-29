import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getCached, setCache } from '../lib/cache'

const getCacheKey = (id) => `razas_${id}`

export function useRazas(idEspecie) {
  const [razas, setRazas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    if (!idEspecie) {
      setRazas([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    const cacheKey = getCacheKey(idEspecie)
    const cached = getCached(cacheKey)
    if (cached) {
      if (isMounted) {
        setRazas(cached)
        setLoading(false)
      }
      return
    }

    const loadRazas = async () => {
      const { data, error } = await supabase
        .from('raza')
        .select('id, nombre')
        .eq('id_especie', idEspecie)

      if (!isMounted) return
      if (error) {
        setError(error.message)
      } else {
        setRazas(data)
        setCache(cacheKey, data)
      }
      setLoading(false)
    }

    loadRazas()
    return () => { isMounted = false }
  }, [idEspecie])

  return { razas, loading, error }
}
