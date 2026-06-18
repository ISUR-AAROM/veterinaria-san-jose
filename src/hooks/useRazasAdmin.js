import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useRazasAdmin(idEspecie) {
  const [razas, setRazas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    if (!idEspecie) {
      setRazas([])
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('raza')
      .select('id, nombre, id_especie, is_active')
      .eq('id_especie', idEspecie)
      .order('nombre')
    if (error) setError(error.message)
    else setRazas(data)
    setLoading(false)
  }, [idEspecie])

  useEffect(() => { cargar() }, [cargar])

  const agregarRaza = useCallback(async (nombre) => {
    if (!idEspecie) return
    const { data, error } = await supabase
      .from('raza')
      .insert({ nombre: nombre.trim(), id_especie: idEspecie })
      .select()
      .single()
    if (error) {
      if (error.code === '23505') throw new Error('Ya existe una raza con ese nombre en esta especie')
      throw error
    }
    setRazas((prev) => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)))
  }, [idEspecie])

  const toggleRaza = useCallback(async (id) => {
    const raza = razas.find((r) => r.id === id)
    if (!raza) return
    const { data, error } = await supabase
      .from('raza')
      .update({ is_active: !raza.is_active })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setRazas((prev) => prev.map((r) => (r.id === id ? data : r)))
  }, [razas])

  return { razas, loading, error, agregarRaza, toggleRaza }
}
