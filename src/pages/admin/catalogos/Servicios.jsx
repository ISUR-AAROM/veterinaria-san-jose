import { useState } from 'react'
import { CatalogoLayout } from '../../../components/catalogos/CatalogoLayout'
import { CatalogoModal } from '../../../components/catalogos/CatalogoModal'
import { ToggleActivoBtn } from '../../../components/catalogos/ToggleActivoBtn'
import { Badge } from '../../../components/ui/Badge'
import { Table } from '../../../components/ui/Table'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { useServiciosAll } from '../../../hooks/useServiciosAll'
import { useCategoriaSala } from '../../../hooks/useCategoriaSala'

const inicial = { nombre: '', descripcion: '', duracion_minutos: '', precio: '', id_categoria_sala: '' }

function EditBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7A6555] hover:bg-[#FAF7F2] hover:text-[#C2570F] transition-colors"
      title="Editar"
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.5 1.5L13.5 3.5L5 12L2 13L3 10L11.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M9 3L12 6" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    </button>
  )
}

export function Servicios() {
  const { servicios, agregar, actualizar, toggleActivo } = useServiciosAll()
  const { categorias } = useCategoriaSala()

  const [modal, setModal] = useState({ open: false, editando: null })
  const [form, setForm] = useState(inicial)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const abrirCrear = () => {
    setForm(inicial)
    setErrors({})
    setModal({ open: true, editando: null })
  }

  const abrirEditar = (s) => {
    setForm({
      nombre: s.nombre,
      descripcion: s.descripcion || '',
      duracion_minutos: String(s.duracion_minutos),
      precio: String(s.precio),
      id_categoria_sala: s.id_categoria_sala,
    })
    setErrors({})
    setModal({ open: true, editando: s })
  }

  const validar = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'Requerido'
    if (!form.duracion_minutos || Number(form.duracion_minutos) < 1) e.duracion_minutos = 'Debe ser mayor a 0'
    if (!form.precio || Number(form.precio) < 0) e.precio = 'Debe ser un monto válido'
    if (!form.id_categoria_sala) e.id_categoria_sala = 'Seleccione una categoría'
    return e
  }

  const guardar = async () => {
    const e = validar()
    setErrors(e)
    if (Object.keys(e).length) return

    setSaving(true)
    try {
      if (modal.editando) {
        await actualizar(modal.editando.id, form)
      } else {
        await agregar(form)
      }
      setModal({ open: false, editando: null })
    } catch {
      // Error propagado del hook
    }
    setSaving(false)
  }

  return (
    <CatalogoLayout titulo="Servicios" descripcion="Administración de servicios ofrecidos" onAgregar={abrirCrear} total={servicios.length}>
      <Table
        headers={['Nombre', 'Descripción', 'Duración', 'Precio', 'Categoría', 'Estado', '']}
        rows={servicios}
        renderRow={(s) => (
          <>
            <td className="px-4 py-3">
              <span className="text-sm font-medium text-[#2C1A0E]">{s.nombre}</span>
            </td>
            <td className="px-4 py-3 text-sm text-[#7A6555]">{s.descripcion || '—'}</td>
            <td className="px-4 py-3">
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">{s.duracion_minutos} min</span>
            </td>
            <td className="px-4 py-3 text-sm font-semibold text-[#2C1A0E]">S/ {Number(s.precio).toFixed(2)}</td>
            <td className="px-4 py-3 text-sm text-[#7A6555]">{s.categoria_nombre}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <Badge activo={s.is_active} />
                <ToggleActivoBtn activo={s.is_active} onToggle={() => toggleActivo(s.id)} nombre={s.nombre} />
              </div>
            </td>
            <td className="px-4 py-3">
              <EditBtn onClick={() => abrirEditar(s)} />
            </td>
          </>
        )}
      />

      <CatalogoModal
        open={modal.open}
        onClose={() => setModal({ open: false, editando: null })}
        titulo={modal.editando ? 'Editar servicio' : 'Nuevo servicio'}
        onGuardar={guardar}
        cargando={saving}
      >
        <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} error={errors.nombre} placeholder="Ej: Consulta General" />
        <Input label="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Breve descripción del servicio" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Duración (min)" type="number" value={form.duracion_minutos} onChange={(e) => setForm({ ...form, duracion_minutos: e.target.value })} error={errors.duracion_minutos} placeholder="30" />
          <Input label="Precio (S/)" type="number" step="0.01" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} error={errors.precio} placeholder="40.00" />
        </div>
        <Select
          label="Categoría de sala"
          value={form.id_categoria_sala}
          onChange={(e) => setForm({ ...form, id_categoria_sala: e.target.value })}
          error={errors.id_categoria_sala}
          options={categorias.map((c) => ({ value: c.id, label: c.nombre }))}
        />
      </CatalogoModal>
    </CatalogoLayout>
  )
}
