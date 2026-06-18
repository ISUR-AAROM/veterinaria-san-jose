import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useServiciosAll() {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('servicio')
      .select(`
        id, nombre, descripcion, duracion_minutos, precio, is_active,
        categoria_sala ( id, nombre )
      `)
      .order('nombre')
    if (error) setError(error.message)
    else setServicios(data)
    setLoading(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const agregar = useCallback(async (datos) => {
    const { data, error } = await supabase
      .from('servicio')
      .insert({
        nombre: datos.nombre.trim(),
        descripcion: datos.descripcion?.trim() || null,
        duracion_minutos: parseInt(datos.duracion_minutos),
        precio: parseFloat(datos.precio),
        id_categoria_sala: datos.id_categoria_sala,
      })
      .select(`id, nombre, descripcion, duracion_minutos, precio, is_active, categoria_sala ( id, nombre )`)
      .single()
    if (error) {
      if (error.code === '23505') throw new Error('Ya existe un servicio con ese nombre')
      throw error
    }
    setServicios((prev) => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)))
  }, [])

  const actualizar = useCallback(async (id, datos) => {
    const { data, error } = await supabase
      .from('servicio')
      .update({
        nombre: datos.nombre.trim(),
        descripcion: datos.descripcion?.trim() || null,
        duracion_minutos: parseInt(datos.duracion_minutos),
        precio: parseFloat(datos.precio),
        id_categoria_sala: datos.id_categoria_sala,
      })
      .eq('id', id)
      .select(`id, nombre, descripcion, duracion_minutos, precio, is_active, categoria_sala ( id, nombre )`)
      .single()
    if (error) {
      if (error.code === '23505') throw new Error('Ya existe un servicio con ese nombre')
      throw error
    }
    setServicios((prev) => prev.map((s) => (s.id === id ? data : s)))
  }, [])

  const toggleActivo = useCallback(async (id) => {
    const servicio = servicios.find((s) => s.id === id)
    if (!servicio) return
    const { data, error } = await supabase
      .from('servicio')
      .update({ is_active: !servicio.is_active })
      .eq('id', id)
      .select(`id, nombre, descripcion, duracion_minutos, precio, is_active, categoria_sala ( id, nombre )`)
      .single()
    if (error) throw error
    setServicios((prev) => prev.map((s) => (s.id === id ? data : s)))
  }, [servicios])

  return { servicios, loading, error, agregar, actualizar, toggleActivo }
}
