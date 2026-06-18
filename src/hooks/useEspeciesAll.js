import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useEspeciesAll() {
  const [especies, setEspecies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('especie_mascota')
      .select('id, nombre, is_active')
      .order('nombre')
    if (error) setError(error.message)
    else setEspecies(data)
    setLoading(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  /**
   * Verifica si ya existe una especie con el mismo nombre (sin importar
   * mayúsculas/minúsculas ni espacios al inicio/fin).
   * Excluye el id actual al editar para no bloquearse a sí misma.
   */
  const existeNombre = useCallback((nombre, excludeId = null) => {
    const normalizado = nombre.trim().toLowerCase()
    return especies.some(
      (e) => e.nombre.trim().toLowerCase() === normalizado && e.id !== excludeId
    )
  }, [especies])

  const agregar = useCallback(async (datos) => {
    if (existeNombre(datos.nombre)) {
      throw { message: `Ya existe una especie llamada "${datos.nombre.trim()}"` }
    }
    const { data, error } = await supabase
      .from('especie_mascota')
      .insert({ nombre: datos.nombre.trim() })
      .select()
      .single()
    if (error) throw error
    setEspecies((prev) => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)))
  }, [existeNombre])

  const actualizar = useCallback(async (id, datos) => {
    if (existeNombre(datos.nombre, id)) {
      throw { message: `Ya existe una especie llamada "${datos.nombre.trim()}"` }
    }
    const { data, error } = await supabase
      .from('especie_mascota')
      .update({ nombre: datos.nombre.trim() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setEspecies((prev) => prev.map((e) => (e.id === id ? data : e)))
  }, [existeNombre])

  const toggleActivo = useCallback(async (id) => {
    const especie = especies.find((e) => e.id === id)
    if (!especie) return
    const { data, error } = await supabase
      .from('especie_mascota')
      .update({ is_active: !especie.is_active })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setEspecies((prev) => prev.map((e) => (e.id === id ? data : e)))
  }, [especies])

  return { especies, loading, error, agregar, actualizar, toggleActivo }
}
