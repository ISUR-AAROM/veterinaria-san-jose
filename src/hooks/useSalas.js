import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useSalas() {
  const [salas, setSalas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('sala')
      .select(`
        id, nombre, capacidad, is_active,
        categoria_sala ( id, nombre )
      `)
      .order('nombre')
    if (error) setError(error.message)
    else setSalas(data)
    setLoading(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const agregar = useCallback(async (datos) => {
    const { data, error } = await supabase
      .from('sala')
      .insert({
        nombre: datos.nombre.trim(),
        capacidad: parseInt(datos.capacidad),
        id_categoria: datos.id_categoria,
      })
      .select(`id, nombre, capacidad, is_active, categoria_sala ( id, nombre )`)
      .single()
    if (error) throw error
    setSalas((prev) => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)))
  }, [])

  const actualizar = useCallback(async (id, datos) => {
    const { data, error } = await supabase
      .from('sala')
      .update({
        nombre: datos.nombre.trim(),
        capacidad: parseInt(datos.capacidad),
        id_categoria: datos.id_categoria,
      })
      .eq('id', id)
      .select(`id, nombre, capacidad, is_active, categoria_sala ( id, nombre )`)
      .single()
    if (error) throw error
    setSalas((prev) => prev.map((s) => (s.id === id ? data : s)))
  }, [])

  const toggleActivo = useCallback(async (id) => {
    const sala = salas.find((s) => s.id === id)
    if (!sala) return
    const { data, error } = await supabase
      .from('sala')
      .update({ is_active: !sala.is_active })
      .eq('id', id)
      .select(`id, nombre, capacidad, is_active, categoria_sala ( id, nombre )`)
      .single()
    if (error) throw error
    setSalas((prev) => prev.map((s) => (s.id === id ? data : s)))
  }, [salas])

  return { salas, loading, error, agregar, actualizar, toggleActivo }
}
