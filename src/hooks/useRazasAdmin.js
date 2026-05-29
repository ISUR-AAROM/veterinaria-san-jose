import { useState, useCallback, useEffect } from 'react'

// MOCK — reemplazar con API real cuando el backend esté listo
const MOCK_POR_ESPECIE = {
  1: [
    { id: 1, nombre: 'Labrador', id_especie: 1, is_active: true },
    { id: 2, nombre: 'Pastor Alemán', id_especie: 1, is_active: true },
    { id: 3, nombre: 'Bulldog', id_especie: 1, is_active: true },
    { id: 4, nombre: 'Chihuahua', id_especie: 1, is_active: false },
  ],
  2: [
    { id: 5, nombre: 'Siamés', id_especie: 2, is_active: true },
    { id: 6, nombre: 'Persa', id_especie: 2, is_active: true },
    { id: 7, nombre: 'Maine Coon', id_especie: 2, is_active: false },
  ],
  3: [
    { id: 8, nombre: 'Holandés', id_especie: 3, is_active: true },
    { id: 9, nombre: 'Angora', id_especie: 3, is_active: true },
  ],
}

let nextId = 10

export function useRazasAdmin(idEspecie) {
  const [razas, setRazas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error] = useState(null)

  const cargar = useCallback(() => {
    if (!idEspecie) {
      setRazas([])
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.resolve().then(() => {
      setRazas(MOCK_POR_ESPECIE[idEspecie] ?? [])
      setLoading(false)
    })
  }, [idEspecie])

  useEffect(() => {
    cargar()
  }, [cargar])

  const agregarRaza = useCallback(async (nombre) => {
    const nuevo = {
      id: nextId++,
      nombre: nombre.trim(),
      id_especie: idEspecie,
      is_active: true,
    }
    setRazas((prev) => [...prev, nuevo])
  }, [idEspecie])

  const toggleRaza = useCallback(async (id) => {
    setRazas((prev) => prev.map((r) =>
      r.id === id ? { ...r, is_active: !r.is_active } : r,
    ))
  }, [])

  return { razas, loading, error, agregarRaza, toggleRaza }
}
