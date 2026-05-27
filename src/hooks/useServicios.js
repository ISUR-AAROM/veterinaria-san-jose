import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useServicios() {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadServicios = async () => {
      const { data, error } = await supabase
        .from('servicio')
        .select('id, nombre, descripcion, duracion_minutos, precio')
        .eq('is_active', true)

      if (!isMounted) return
      if (!error) setServicios(data)
      setLoading(false)
    }

    loadServicios()

    return () => {
      isMounted = false
    }
  }, [])

  return { servicios, loading }
}
