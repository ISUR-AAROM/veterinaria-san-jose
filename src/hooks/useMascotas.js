import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useMascotas() {
  const [mascotas, setMascotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setMascotas([])
      setLoading(false)
      return
    }

    const { data: cliente, error: clienteError } = await supabase
      .from('cliente')
      .select('id')
      .eq('id_cuenta', session.user.id)
      .single()

    if (clienteError || !cliente) {
      setError('No se pudo identificar al cliente')
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('mascota')
      .select(`
        id, nombre, fecha_nacimiento, is_active,
        especie_mascota ( id, nombre ),
        raza ( id, nombre )
      `)
      .eq('id_cliente', cliente.id)
      .eq('is_active', true)
      .order('nombre')

    if (error) setError(error.message)
    else setMascotas(data)
    setLoading(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const agregar = useCallback(async (datos) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('No autenticado')

    const { data: cliente, error: clienteError } = await supabase
      .from('cliente')
      .select('id')
      .eq('id_cuenta', session.user.id)
      .single()
    if (clienteError || !cliente) throw new Error('No se pudo identificar al cliente')

    const { data: mascota, error: mascotaError } = await supabase
      .from('mascota')
      .insert({
        id_cliente: cliente.id,
        id_especie: datos.id_especie,
        id_raza: datos.id_raza || null,
        nombre: datos.nombre.trim(),
        fecha_nacimiento: datos.fecha_nacimiento,
      })
      .select(`
        id, nombre, fecha_nacimiento, is_active,
        especie_mascota ( id, nombre ),
        raza ( id, nombre )
      `)
      .single()
    if (mascotaError) throw mascotaError

    const { error: historiaError } = await supabase
      .from('historia_clinica')
      .insert({ id_mascota: mascota.id })
    if (historiaError) throw historiaError

    setMascotas((prev) => [...prev, mascota].sort((a, b) => a.nombre.localeCompare(b.nombre)))
    return mascota
  }, [])

  const actualizar = useCallback(async (id, datos) => {
    const { data, error } = await supabase
      .from('mascota')
      .update({
        nombre: datos.nombre.trim(),
        id_especie: datos.id_especie,
        id_raza: datos.id_raza || null,
        fecha_nacimiento: datos.fecha_nacimiento,
      })
      .eq('id', id)
      .select(`
        id, nombre, fecha_nacimiento, is_active,
        especie_mascota ( id, nombre ),
        raza ( id, nombre )
      `)
      .single()
    if (error) throw error
    setMascotas((prev) => prev.map((m) => (m.id === id ? data : m)))
    return data
  }, [])

  const desactivar = useCallback(async (id) => {
    const { error } = await supabase
      .from('mascota')
      .update({ is_active: false })
      .eq('id', id)
    if (error) throw error
    setMascotas((prev) => prev.filter((m) => m.id !== id))
  }, [])

  return { mascotas, loading, error, agregar, actualizar, desactivar, recargar: cargar }
}
