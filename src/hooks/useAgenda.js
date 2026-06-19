import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { supabase } from '../lib/supabase'

export function useAgenda(fecha) {
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const channelRef = useRef(null)
  const cargandoRef = useRef(false)

  const cargar = useCallback(async () => {
    if (cargandoRef.current) return
    cargandoRef.current = true
    setLoading(true)
    setError(null)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      cargandoRef.current = false
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('cita')
        .select(`
          id, estado,
          hueco!inner (
            id, fecha, hora_inicio, hora_fin,
            sala!inner ( id, nombre ),
            servicio ( id, nombre )
          ),
          mascota ( id, nombre ),
          cliente ( id, nombre, apellido, telefono )
        `)
        .eq('hueco.fecha', fecha)
        .in('estado', ['PROGRAMADA', 'EN_ESPERA', 'FINALIZADA'])
      if (error) {
        setError(error.message)
        setCitas([])
      } else {
        setCitas(data || [])
      }
    } catch (err) {
      setError(err.message)
      setCitas([])
    } finally {
      setLoading(false)
      cargandoRef.current = false
    }
  }, [fecha])

  const citasOrdenadas = useMemo(() => {
    return [...citas].sort((a, b) => {
      const aInicio = a.hueco?.hora_inicio || ''
      const bInicio = b.hueco?.hora_inicio || ''
      return aInicio.localeCompare(bInicio)
    })
  }, [citas])

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

  return { citas: citasOrdenadas, loading, error, recargar: cargar }
}
