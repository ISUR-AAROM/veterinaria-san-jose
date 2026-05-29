import { useState, useCallback } from 'react'

const MOCK = [
  { id: 1, nombre: 'Consultorio A', capacidad: 2, id_categoria: 1, categoria_nombre: 'Consultorio', is_active: true, created_at: '2025-01-01' },
  { id: 2, nombre: 'Quirófano 1', capacidad: 5, id_categoria: 2, categoria_nombre: 'Quirófano', is_active: true, created_at: '2025-01-01' },
  { id: 3, nombre: 'Sala de estética', capacidad: 3, id_categoria: 3, categoria_nombre: 'Estética', is_active: true, created_at: '2025-01-01' },
  { id: 4, nombre: 'Consultorio B', capacidad: 2, id_categoria: 1, categoria_nombre: 'Consultorio', is_active: false, created_at: '2025-01-01' },
]

// MOCK — reemplazar con API real cuando el backend esté listo
const CATEGORIA_MAP = { 1: 'Consultorio', 2: 'Quirófano', 3: 'Estética' }

let nextId = 5

export function useSalas({ soloActivas = false } = {}) {
  const [salas, setSalas] = useState(() =>
    soloActivas ? MOCK.filter((s) => s.is_active) : MOCK,
  )
  const [loading] = useState(false)
  const [error] = useState(null)

  const agregar = useCallback(async (datos) => {
    const nuevo = {
      id: nextId++,
      nombre: datos.nombre.trim(),
      capacidad: Number(datos.capacidad),
      id_categoria: Number(datos.id_categoria),
      categoria_nombre: CATEGORIA_MAP[Number(datos.id_categoria)] ?? '',
      is_active: true,
      created_at: new Date().toISOString(),
    }
    setSalas((prev) => {
      const next = [...prev, nuevo]
      return soloActivas ? next.filter((s) => s.is_active) : next
    })
  }, [soloActivas])

  const actualizar = useCallback(async (id, datos) => {
    setSalas((prev) => prev.map((s) =>
      s.id === id
        ? { ...s, nombre: datos.nombre.trim(), capacidad: Number(datos.capacidad), id_categoria: Number(datos.id_categoria), categoria_nombre: CATEGORIA_MAP[Number(datos.id_categoria)] ?? s.categoria_nombre }
        : s,
    ))
  }, [])

  const toggleActivo = useCallback(async (id) => {
    setSalas((prev) => prev.map((s) =>
      s.id === id ? { ...s, is_active: !s.is_active } : s,
    ))
  }, [])

  return { salas, loading, error, agregar, actualizar, toggleActivo }
}
