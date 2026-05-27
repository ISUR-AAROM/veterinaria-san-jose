import { useMemo } from 'react'
import { useRazas } from '../../hooks/useRazas'
import { Select } from '../ui/Select'

export function SelectRazaFiltrada({ idEspecie, error, value, onChange }) {
  const { razas, loading } = useRazas(idEspecie)

  const razaOptions = useMemo(() => razas.map((r) => ({ value: r.id, label: r.nombre })), [razas])

  return (
    <Select
      label="Raza"
      placeholder={loading ? 'Cargando...' : idEspecie ? 'Seleccionar raza' : 'Primero selecciona una especie'}
      options={razaOptions}
      value={value}
      onChange={onChange}
      error={error}
      disabled={!idEspecie || loading}
    />
  )
}
