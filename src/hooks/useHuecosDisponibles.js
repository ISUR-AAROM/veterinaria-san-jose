import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'

function getLocalDateString(date) {
  const d = date || new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function timeToMinutes(str) {
  if (!str) return 0
  const parts = str.split(':')
  if (parts.length < 2) return 0
  return Number(parts[0]) * 60 + Number(parts[1])
}

export function useHuecosDisponibles(idServicio, fecha) {
  const [huecos, setHuecos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!idServicio || !fecha) {
      setHuecos([])
      setLoading(false)
      return
    }

    let isMounted = true
    setLoading(true)

    const load = async () => {
      const { data, error } = await supabase
        .from('hueco')
        .select(`
          id, fecha, hora_inicio, hora_fin,
          sala ( id, nombre )
        `)
        .eq('id_servicio', idServicio)
        .eq('bloqueado', false)
        .eq('fecha', fecha)
        .order('hora_inicio', { ascending: true })

      if (!isMounted) return
      if (error) {
        setError(error.message)
        setHuecos([])
      } else {
        setHuecos(data || [])
      }
      setLoading(false)
    }

    load()
    return () => { isMounted = false }
  }, [idServicio, fecha])

  const huecosFiltrados = useMemo(() => {
    const ahora = new Date()
    const hoyLocal = getLocalDateString()
    const ahoraMinutos = ahora.getHours() * 60 + ahora.getMinutes()
    return huecos.filter((h) => {
      if (h.fecha < hoyLocal) return false
      if (h.fecha !== hoyLocal) return true
      return timeToMinutes(h.hora_inicio) > ahoraMinutos
    })
  }, [huecos])

  const agrupadosPorFecha = useMemo(() => {
    return huecosFiltrados.reduce((acc, h) => {
      const key = h.fecha
      if (!acc[key]) acc[key] = []
      acc[key].push(h)
      return acc
    }, {})
  }, [huecosFiltrados])

  return { huecos: huecosFiltrados, agrupadosPorFecha, loading, error }
}
