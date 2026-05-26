import { useRazas } from '../../hooks/useRazas'
import { Select } from '../ui'

export function SelectRazaFiltrada({ idEspecie, error, value, onChange }) {
  const { razas, loading } = useRazas(idEspecie)

  return (
    <Select
      label="Raza"
      placeholder={loading ? 'Cargando...' : idEspecie ? 'Seleccionar raza' : 'Primero selecciona una especie'}
      options={razas.map((r) => ({ value: r.id, label: r.nombre }))}
      value={value}
      onChange={onChange}
      error={error}
      disabled={!idEspecie || loading}
    />
  )
}
