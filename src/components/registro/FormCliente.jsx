import { useTipoDocumento } from '../../hooks/useTipoDocumento'
import { Input, Select, Button } from '../ui'

export function FormCliente({ data, onChange, onSubmit, errors }) {
  const { tipos } = useTipoDocumento()

  const handleChange = (field) => (e) => onChange({ ...data, [field]: e.target.value })

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Select
        label="Tipo de documento"
        placeholder="Seleccionar tipo"
        options={tipos.map((t) => ({ value: t.id, label: t.nombre }))}
        value={data.id_tipo_documento}
        onChange={handleChange('id_tipo_documento')}
        error={errors.id_tipo_documento}
      />
      <Input
        label="Número de documento"
        placeholder="Ingresa tu número"
        value={data.numero_documento}
        onChange={handleChange('numero_documento')}
        error={errors.numero_documento}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nombre"
          placeholder="Tu nombre"
          value={data.nombre}
          onChange={handleChange('nombre')}
          error={errors.nombre}
        />
        <Input
          label="Apellido"
          placeholder="Tu apellido"
          value={data.apellido}
          onChange={handleChange('apellido')}
          error={errors.apellido}
        />
      </div>
      <Input
        label="Teléfono"
        type="tel"
        placeholder="999 999 999"
        value={data.telefono}
        onChange={handleChange('telefono')}
        error={errors.telefono}
        maxLength={9}
      />
      <Input
        label="Email"
        type="email"
        placeholder="correo@ejemplo.com"
        value={data.email}
        onChange={handleChange('email')}
        error={errors.email}
      />
      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={data.password}
        onChange={handleChange('password')}
        error={errors.password}
      />
      <Input
        label="Confirmar contraseña"
        type="password"
        placeholder="••••••••"
        value={data.confirmarPassword}
        onChange={handleChange('confirmarPassword')}
        error={errors.confirmarPassword}
      />
      <Button type="submit" className="w-full">
        Siguiente
      </Button>
    </form>
  )
}
