import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useAgenda(fecha) {
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const channelRef = useRef(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('cita')
      .select(`
        id, estado, created_at,
        hueco!inner (
          id, fecha, hora_inicio, hora_fin,
          sala!inner ( id, nombre )
        ),
        mascota ( id, nombre ),
        cliente ( id, nombre, apellido, telefono ),
        servicio!inner ( id, nombre )
      `)
      .eq('hueco.fecha', fecha)
      .in('estado', ['PROGRAMADA', 'EN_ESPERA', 'FINALIZADA'])
      .order('hueco(hora_inicio)', { ascending: true })
    if (error) setError(error.message)
    else setCitas(data || [])
    setLoading(false)
  }, [fecha])

  useEffect(() => {
    cargar()

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    const channel = supabase
      .channel(`agenda-${fecha}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cita' },
        () => cargar()
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [cargar])

  return { citas, loading, error, recargar: cargar }
}
