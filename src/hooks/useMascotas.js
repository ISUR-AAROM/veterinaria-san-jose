import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useMascotas(idCliente) {
  const [mascotas, setMascotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    if (!idCliente) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('mascota')
      .select(`
        id, nombre, fecha_nacimiento, is_active,
        especie:especie_mascota ( id, nombre ),
        raza:raza ( id, nombre )
      `)
      .eq('id_cliente', idCliente)
    if (error) {
      setError(error.message)
      setMascotas([])
    } else {
      setMascotas(data || [])
    }
    setLoading(false)
  }, [idCliente])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { mascotas, loading, error, recargar: cargar }
}
