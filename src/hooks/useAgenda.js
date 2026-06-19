import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const POLL_INTERVAL_MS = 20000

export function useAgenda(fecha) {
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [connected, setConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const channelRef = useRef(null)
  const pollRef = useRef(null)

  const cargar = useCallback(async (opts) => {
    if (opts?.showLoading) setLoading(true)
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
    setLastUpdate(new Date())
    if (opts?.showLoading) setLoading(false)
  }, [fecha])

  useEffect(() => {
    let cancelled = false
    const channelName = `agenda-${fecha}-${Date.now()}-${Math.random()}`

    const init = async () => {
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
      if (cancelled) return

      cargar({ showLoading: true })

      if (cancelled) return

      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'cita' },
          () => cargar()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'hueco' },
          () => cargar()
        )
        .subscribe((status) => {
          if (!cancelled) setConnected(status === 'SUBSCRIBED')
        })

      channelRef.current = channel

      if (pollRef.current) clearInterval(pollRef.current)
      pollRef.current = setInterval(() => cargar(), POLL_INTERVAL_MS)
    }

    init()

    return () => {
      cancelled = true
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }, [cargar, fecha])

  return { citas, loading, error, connected, lastUpdate, recargar: cargar }
}
