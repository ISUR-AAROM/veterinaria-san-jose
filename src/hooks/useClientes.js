import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useClientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const cargandoRef = useRef(false)

  const cargar = useCallback(async (busqueda = '') => {
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
      let query = supabase
        .from('cliente')
        .select(`
          id, nombre, apellido, numero_documento, telefono,
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
        console.error('[useClientes] Error al cargar clientes:', error.message)
        setError(error.message)
        setClientes([])
      } else {
        const clientesData = data || []
        let countMap = {}

        if (clientesData.length > 0) {
          const clientIds = clientesData.map((c) => c.id)
          const { data: mascotasData, error: mascotasError } = await supabase
            .from('mascota')
            .select('id_cliente')
            .eq('is_active', true)
            .in('id_cliente', clientIds)

          if (mascotasError) {
            console.error('[useClientes] Error al contar mascotas:', mascotasError.message)
          } else if (mascotasData) {
            countMap = {}
            for (const m of mascotasData) {
              countMap[m.id_cliente] = (countMap[m.id_cliente] || 0) + 1
            }
          }
        }

        const clientsWithCount = clientesData.map((cliente) => ({
          ...cliente,
          mascotas_activas: countMap[cliente.id] || 0,
        }))

        setClientes(clientsWithCount)
      }
    } catch (err) {
      console.error('[useClientes] Error inesperado:', err)
      setError(err.message)
    } finally {
      setLoading(false)
      cargandoRef.current = false
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  return { clientes, loading, error, buscar: cargar }
}
