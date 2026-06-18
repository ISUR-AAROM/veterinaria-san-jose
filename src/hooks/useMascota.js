import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook para obtener el detalle de UNA mascota por id.
 * Útil para vistas de detalle (admin) o edición.
 */
export function useMascota(id) {
  const [mascota, setMascota] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    if (!id) {
      setMascota(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('mascota')
      .select(`
        id, nombre, fecha_nacimiento, is_active,
        especie_mascota ( id, nombre ),
        raza ( id, nombre ),
        cliente ( id, nombre, apellido, telefono )
      `)
      .eq('id', id)
      .single()

    if (error) setError(error.message)
    else setMascota(data)
    setLoading(false)
  }, [id])

  useEffect(() => { cargar() }, [cargar])

  return { mascota, loading, error, recargar: cargar }
}
