import { useState, useCallback } from 'react'

// MOCK — reemplazar con API real cuando el backend esté listo
const MOCK = [
  { id: 1, nombre: 'Perro', is_active: true, created_at: '2025-01-01' },
  { id: 2, nombre: 'Gato', is_active: true, created_at: '2025-01-01' },
  { id: 3, nombre: 'Conejo', is_active: true, created_at: '2025-01-01' },
  { id: 4, nombre: 'Ave', is_active: false, created_at: '2025-01-01' },
]

let nextId = 5

export function useEspeciesAll() {
  const [especies, setEspecies] = useState(MOCK)
  const [loading] = useState(false)
  const [error] = useState(null)

  const agregar = useCallback(async (datos) => {
    const nuevo = {
      id: nextId++,
      nombre: datos.nombre.trim(),
      is_active: true,
      created_at: new Date().toISOString(),
    }
    setEspecies((prev) => [...prev, nuevo])
  }, [])

  const actualizar = useCallback(async (id, datos) => {
    setEspecies((prev) => prev.map((e) =>
      e.id === id ? { ...e, nombre: datos.nombre.trim() } : e,
    ))
  }, [])

  const toggleActivo = useCallback(async (id) => {
    setEspecies((prev) => prev.map((e) =>
      e.id === id ? { ...e, is_active: !e.is_active } : e,
    ))
  }, [])

  return { especies, loading, error, agregar, actualizar, toggleActivo }
}
