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

    const clientIds = (data || []).map((c) => c.id)
    const { data: mascotasData } = await supabase
      .from('mascota')
      .select('id_cliente')
      .eq('is_active', true)
      .in('id_cliente', clientIds)

    const countMap = {}
    if (mascotasData) {
      for (const m of mascotasData) {
        countMap[m.id_cliente] = (countMap[m.id_cliente] || 0) + 1
      }
    }

    const clientsWithCount = (data || []).map((cliente) => ({
      ...cliente,
      mascotas_activas: countMap[cliente.id] || 0,
    }))

    setClientes(clientsWithCount)
    setLoading(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  return { clientes, loading, error, buscar: cargar }
}
