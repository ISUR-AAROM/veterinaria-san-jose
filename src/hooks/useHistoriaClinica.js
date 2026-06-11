import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useHistoriaClinica(idMascota) {
  const [entradas, setEntradas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    if (!idMascota) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data: hc } = await supabase
      .from('historia_clinica')
      .select('id')
      .eq('id_mascota', idMascota)
      .single()

    if (!hc) {
      setLoading(false)
      setEntradas([])
      return
    }

    const { data, error } = await supabase
      .from('entrada_historia_clinica')
      .select(`
        id, diagnostico, observaciones, created_at,
        tipo_entrada ( id, nombre )
      `)
      .eq('id_historia_clinica', hc.id)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setEntradas(data || [])
    setLoading(false)
  }, [idMascota])

  useEffect(() => { cargar() }, [cargar])

  return { entradas, loading, error, recargar: cargar }
}
