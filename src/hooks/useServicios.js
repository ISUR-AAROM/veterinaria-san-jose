import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useServicios() {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('servicio')
      .select('id, nombre, descripcion, duracion_minutos, precio')
      .eq('is_active', true)
      .then(({ data, error }) => {
        if (!error) setServicios(data)
        setLoading(false)
      })
  }, [])

  return { servicios, loading }
}
