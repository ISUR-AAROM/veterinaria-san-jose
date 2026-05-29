import { useState, useCallback } from 'react'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

// MOCK — reemplazar con API real cuando el backend esté listo
const MOCK = [
  { id: 1, id_servicio: 1, id_sala: 1, dia_semana: 1, dia_nombre: 'Lunes', hora_inicio: '08:00:00', hora_fin: '12:00:00', intervalo_minutos: 30, is_active: true, servicio_nombre: 'Consulta general', sala_nombre: 'Consultorio A' },
  { id: 2, id_servicio: 2, id_sala: 1, dia_semana: 1, dia_nombre: 'Lunes', hora_inicio: '14:00:00', hora_fin: '18:00:00', intervalo_minutos: 30, is_active: true, servicio_nombre: 'Vacunación', sala_nombre: 'Consultorio A' },
  { id: 3, id_servicio: 1, id_sala: 1, dia_semana: 3, dia_nombre: 'Miércoles', hora_inicio: '08:00:00', hora_fin: '12:00:00', intervalo_minutos: 30, is_active: true, servicio_nombre: 'Consulta general', sala_nombre: 'Consultorio A' },
  { id: 4, id_servicio: 3, id_sala: 2, dia_semana: 2, dia_nombre: 'Martes', hora_inicio: '09:00:00', hora_fin: '13:00:00', intervalo_minutos: 60, is_active: false, servicio_nombre: 'Cirugía menor', sala_nombre: 'Quirófano 1' },
]

let nextId = 5

export function usePlantillas() {
  const [plantillas, setPlantillas] = useState(MOCK)
  const [loading] = useState(false)
  const [error] = useState(null)

  const agregar = useCallback(async (datos) => {
    const nuevo = {
      id: nextId++,
      id_servicio: Number(datos.id_servicio),
      id_sala: Number(datos.id_sala),
      dia_semana: Number(datos.dia_semana),
      dia_nombre: DIAS[Number(datos.dia_semana)],
      hora_inicio: datos.hora_inicio,
      hora_fin: datos.hora_fin,
      intervalo_minutos: Number(datos.intervalo_minutos),
      is_active: true,
      servicio_nombre: '—',
      sala_nombre: '—',
    }
    setPlantillas((prev) => [...prev, nuevo])
  }, [])

  const actualizar = useCallback(async (id, datos) => {
    setPlantillas((prev) => prev.map((p) =>
      p.id === id
        ? {
            ...p,
            id_servicio: Number(datos.id_servicio),
            id_sala: Number(datos.id_sala),
            dia_semana: Number(datos.dia_semana),
            dia_nombre: DIAS[Number(datos.dia_semana)],
            hora_inicio: datos.hora_inicio,
            hora_fin: datos.hora_fin,
            intervalo_minutos: Number(datos.intervalo_minutos),
          }
        : p,
    ))
  }, [])

  const toggleActivo = useCallback(async (id) => {
    setPlantillas((prev) => prev.map((p) =>
      p.id === id ? { ...p, is_active: !p.is_active } : p,
    ))
  }, [])

  return { plantillas, loading, error, agregar, actualizar, toggleActivo }
}
