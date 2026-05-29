import { useState } from 'react'
import { CatalogoLayout } from '../../../components/catalogos/CatalogoLayout'
import { CatalogoModal } from '../../../components/catalogos/CatalogoModal'
import { ToggleActivoBtn } from '../../../components/catalogos/ToggleActivoBtn'
import { Badge } from '../../../components/ui/Badge'
import { Table } from '../../../components/ui/Table'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { useSalas } from '../../../hooks/useSalas'
import { useCategoriaSala } from '../../../hooks/useCategoriaSala'

const inicial = { nombre: '', capacidad: '', id_categoria: '' }

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

export function Salas() {
  const { salas, agregar, actualizar, toggleActivo } = useSalas()
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
      capacidad: String(s.capacidad),
      id_categoria: s.id_categoria,
    })
    setErrors({})
    setModal({ open: true, editando: s })
  }

  const validar = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'Requerido'
    if (!form.capacidad || Number(form.capacidad) < 1) e.capacidad = 'Debe ser mayor a 0'
    if (!form.id_categoria) e.id_categoria = 'Seleccione una categoría'
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
    } catch { /* error propagado */ }
    setSaving(false)
  }

  return (
    <CatalogoLayout titulo="Salas" descripcion="Administración de salas y consultorios" onAgregar={abrirCrear} total={salas.length}>
      <Table
        headers={['Nombre', 'Categoría', 'Capacidad', 'Estado', '']}
        rows={salas}
        renderRow={(s) => (
          <>
            <td className="px-4 py-3">
              <span className="text-sm font-medium text-[#2C1A0E]">{s.nombre}</span>
            </td>
            <td className="px-4 py-3 text-sm text-[#7A6555]">{s.categoria_nombre}</td>
            <td className="px-4 py-3 text-sm text-[#2C1A0E]">{s.capacidad}</td>
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
        titulo={modal.editando ? 'Editar sala' : 'Nueva sala'}
        onGuardar={guardar}
        cargando={saving}
      >
        <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} error={errors.nombre} placeholder="Ej: Consultorio 1" />
        <Select
          label="Categoría"
          value={form.id_categoria}
          onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}
          error={errors.id_categoria}
          options={categorias.map((c) => ({ value: c.id, label: c.nombre }))}
        />
        <Input label="Capacidad" type="number" value={form.capacidad} onChange={(e) => setForm({ ...form, capacidad: e.target.value })} error={errors.capacidad} placeholder="1" />
      </CatalogoModal>
    </CatalogoLayout>
  )
}
