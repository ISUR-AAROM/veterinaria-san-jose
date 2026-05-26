import { useEspecies } from '../../hooks/useEspecies'
import { Input, Select, Button } from '../ui'
import { SelectRazaFiltrada } from './SelectRazaFiltrada'

export function FormMascota({ data, onChange, onSubmit, errors, submitLabel = 'Finalizar registro' }) {
  const { especies } = useEspecies()

  const handleChange = (field) => (e) => onChange({ ...data, [field]: e.target.value })

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Nombre de la mascota"
        placeholder="Ej: Firulais"
        value={data.nombre}
        onChange={handleChange('nombre')}
        error={errors.nombre}
      />
      <Select
        label="Especie"
        placeholder="Seleccionar especie"
        options={especies.map((e) => ({ value: e.id, label: e.nombre }))}
        value={data.id_especie}
        onChange={handleChange('id_especie')}
        error={errors.id_especie}
      />
      <SelectRazaFiltrada
        idEspecie={data.id_especie}
        value={data.id_raza}
        onChange={handleChange('id_raza')}
        error={errors.id_raza}
      />
      <Input
        label="Fecha de nacimiento"
        type="date"
        value={data.fecha_nacimiento}
        onChange={handleChange('fecha_nacimiento')}
        error={errors.fecha_nacimiento}
      />
      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  )
}
