import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useClientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async (busqueda = '') => {
    setLoading(true)
    let query = supabase
      .from('cliente')
      .select(`
        id, nombre, apellido, numero_documento, telefono, email,
        tipo_documento ( id, nombre )
      `)

    if (busqueda.trim()) {
      const term = busqueda.trim()
      query = query.or(
        `nombre.ilike.%${term}%,apellido.ilike.%${term}%,numero_documento.ilike.%${term}%`
      )
    }

    const { data, error } = await query.order('nombre')

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const clientsWithCount = await Promise.all(
      (data || []).map(async (cliente) => {
        const { count } = await supabase
          .from('mascota')
          .select('*', { count: 'exact', head: true })
          .eq('id_cliente', cliente.id)
          .eq('is_active', true)
        return { ...cliente, mascotas_activas: count || 0 }
      })
    )

    setClientes(clientsWithCount)
    setLoading(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  return { clientes, loading, error, buscar: cargar }
}
