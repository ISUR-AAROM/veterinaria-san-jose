import { useState, useCallback } from 'react'

const MOCK = [
  { id: 1, nombre: 'Consulta general', descripcion: 'Revisión médica completa', duracion_minutos: 30, precio: 150, id_categoria_sala: 1, categoria_nombre: 'Consultorio', is_active: true, created_at: '2025-01-01' },
  { id: 2, nombre: 'Vacunación', descripcion: 'Aplicación de vacunas', duracion_minutos: 20, precio: 80, id_categoria_sala: 1, categoria_nombre: 'Consultorio', is_active: true, created_at: '2025-01-01' },
  { id: 3, nombre: 'Cirugía menor', descripcion: 'Procedimientos quirúrgicos ambulatorios', duracion_minutos: 60, precio: 400, id_categoria_sala: 2, categoria_nombre: 'Quirófano', is_active: true, created_at: '2025-01-01' },
  { id: 4, nombre: 'Estética', descripcion: 'Baño y corte de uñas', duracion_minutos: 45, precio: 120, id_categoria_sala: 3, categoria_nombre: 'Estética', is_active: true, created_at: '2025-01-01' },
  { id: 5, nombre: 'Radiografía', descripcion: 'Toma de placas radiográficas', duracion_minutos: 30, precio: 200, id_categoria_sala: 2, categoria_nombre: 'Quirófano', is_active: false, created_at: '2025-01-01' },
]

// MOCK — reemplazar con API real cuando el backend esté listo
const CATEGORIA_MAP = { 1: 'Consultorio', 2: 'Quirófano', 3: 'Estética' }

let nextId = 6

export function useServiciosAll() {
  const [servicios, setServicios] = useState(MOCK)
  const [loading] = useState(false)
  const [error] = useState(null)

  const agregar = useCallback(async (datos) => {
    const nuevo = {
      id: nextId++,
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion?.trim() || null,
      duracion_minutos: Number(datos.duracion_minutos),
      precio: Number(datos.precio),
      id_categoria_sala: Number(datos.id_categoria_sala),
      categoria_nombre: CATEGORIA_MAP[Number(datos.id_categoria_sala)] ?? '',
      is_active: true,
      created_at: new Date().toISOString(),
    }
    setServicios((prev) => [...prev, nuevo])
  }, [])

  const actualizar = useCallback(async (id, datos) => {
    setServicios((prev) => prev.map((s) =>
      s.id === id
        ? {
            ...s,
            nombre: datos.nombre.trim(),
            descripcion: datos.descripcion?.trim() || null,
            duracion_minutos: Number(datos.duracion_minutos),
            precio: Number(datos.precio),
            id_categoria_sala: Number(datos.id_categoria_sala),
            categoria_nombre: CATEGORIA_MAP[Number(datos.id_categoria_sala)] ?? s.categoria_nombre,
          }
        : s,
    ))
  }, [])

  const toggleActivo = useCallback(async (id) => {
    setServicios((prev) => prev.map((s) =>
      s.id === id ? { ...s, is_active: !s.is_active } : s,
    ))
  }, [])

  return { servicios, loading, error, agregar, actualizar, toggleActivo }
}
