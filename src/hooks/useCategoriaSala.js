import { useState } from 'react'

// MOCK — reemplazar con API real cuando el backend esté listo
const MOCK = [
  { id: 1, nombre: 'Consultorio' },
  { id: 2, nombre: 'Quirófano' },
  { id: 3, nombre: 'Estética' },
]

export function useCategoriaSala() {
  const [categorias] = useState(MOCK)
  const [loading] = useState(false)

  return { categorias, loading }
}
