import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getCached, setCache } from '../lib/cache'

const CACHE_KEY = 'servicios_activos'

export function useServicios() {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadServicios = async () => {
      const cached = getCached(CACHE_KEY)
      if (cached) {
        if (isMounted) {
          setServicios(cached)
          setLoading(false)
        }
        return
      }

      const { data, error } = await supabase
        .from('servicio')
        .select('id, nombre, descripcion, duracion_minutos, precio')
        .eq('is_active', true)

      if (!isMounted) return
      if (error) {
        setError(error.message)
      } else {
        setServicios(data)
        setCache(CACHE_KEY, data)
      }
      setLoading(false)
    }

    loadServicios()
    return () => { isMounted = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps — solo al montar

  return { servicios, loading, error }
}
