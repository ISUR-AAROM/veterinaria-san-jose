import { useState } from 'react'
import { CatalogoLayout } from '../../../components/catalogos/CatalogoLayout'
import { CatalogoModal } from '../../../components/catalogos/CatalogoModal'
import { ToggleActivoBtn } from '../../../components/catalogos/ToggleActivoBtn'
import { Badge } from '../../../components/ui/Badge'
import { Table } from '../../../components/ui/Table'
import { Select } from '../../../components/ui/Select'
import { Input } from '../../../components/ui/Input'
import { usePlantillas } from '../../../hooks/usePlantillas'
import { useServicios } from '../../../hooks/useServicios'
import { useSalas } from '../../../hooks/useSalas'

const DIAS = [
  { value: '0', label: 'Domingo' },
  { value: '1', label: 'Lunes' },
  { value: '2', label: 'Martes' },
  { value: '3', label: 'Miércoles' },
  { value: '4', label: 'Jueves' },
  { value: '5', label: 'Viernes' },
  { value: '6', label: 'Sábado' },
]

const inicial = { id_servicio: '', id_sala: '', dia_semana: '', hora_inicio: '', hora_fin: '', intervalo_minutos: '' }

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

export function Plantillas() {
  const { plantillas, agregar, actualizar, toggleActivo } = usePlantillas()
  const { servicios } = useServicios()
  const { salas } = useSalas({ soloActivas: true })

  const [modal, setModal] = useState({ open: false, editando: null })
  const [form, setForm] = useState(inicial)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const abrirCrear = () => {
    setForm(inicial)
    setErrors({})
    setModal({ open: true, editando: null })
  }

  const abrirEditar = (p) => {
    setForm({
      id_servicio: p.id_servicio,
      id_sala: p.id_sala,
      dia_semana: String(p.dia_semana),
      hora_inicio: p.hora_inicio?.slice(0, 5) ?? '',
      hora_fin: p.hora_fin?.slice(0, 5) ?? '',
      intervalo_minutos: String(p.intervalo_minutos),
    })
    setErrors({})
    setModal({ open: true, editando: p })
  }

  const validar = () => {
    const e = {}
    if (!form.id_servicio) e.id_servicio = 'Seleccione un servicio'
    if (!form.id_sala) e.id_sala = 'Seleccione una sala'
    if (!form.dia_semana) e.dia_semana = 'Seleccione un día'
    if (!form.hora_inicio) e.hora_inicio = 'Requerido'
    if (!form.hora_fin) e.hora_fin = 'Requerido'
    if (!form.intervalo_minutos || Number(form.intervalo_minutos) < 1) e.intervalo_minutos = 'Debe ser mayor a 0'
    if (form.hora_inicio && form.hora_fin && form.hora_inicio >= form.hora_fin) e.hora_fin = 'Debe ser después de inicio'
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
    <CatalogoLayout titulo="Plantillas de horario" descripcion="Administración de plantillas de horario por servicio y sala" onAgregar={abrirCrear} total={plantillas.length}>
      <Table
        headers={['Servicio', 'Sala', 'Día', 'Inicio', 'Fin', 'Intervalo', 'Estado', '']}
        rows={plantillas}
        renderRow={(p) => (
          <>
            <td className="px-4 py-3">
              <span className="text-sm font-medium text-[#2C1A0E]">{p.servicio_nombre}</span>
            </td>
            <td className="px-4 py-3 text-sm text-[#7A6555]">{p.sala_nombre}</td>
            <td className="px-4 py-3 text-sm text-[#2C1A0E]">{p.dia_nombre}</td>
            <td className="px-4 py-3 font-mono text-sm text-[#2C1A0E]">{p.hora_inicio?.slice(0, 5) ?? ''}</td>
            <td className="px-4 py-3 font-mono text-sm text-[#2C1A0E]">{p.hora_fin?.slice(0, 5) ?? ''}</td>
            <td className="px-4 py-3">
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">{p.intervalo_minutos} min</span>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <Badge activo={p.is_active} />
                <ToggleActivoBtn activo={p.is_active} onToggle={() => toggleActivo(p.id)} nombre="plantilla" />
              </div>
            </td>
            <td className="px-4 py-3">
              <EditBtn onClick={() => abrirEditar(p)} />
            </td>
          </>
        )}
      />

      <CatalogoModal
        open={modal.open}
        onClose={() => setModal({ open: false, editando: null })}
        titulo={modal.editando ? 'Editar plantilla' : 'Nueva plantilla'}
        onGuardar={guardar}
        cargando={saving}
      >
        <Select
          label="Servicio"
          value={form.id_servicio}
          onChange={(e) => setForm({ ...form, id_servicio: e.target.value })}
          error={errors.id_servicio}
          options={servicios.map((s) => ({ value: s.id, label: s.nombre }))}
        />
        <Select
          label="Sala"
          value={form.id_sala}
          onChange={(e) => setForm({ ...form, id_sala: e.target.value })}
          error={errors.id_sala}
          options={salas.map((s) => ({ value: s.id, label: `${s.nombre} (${s.categoria_nombre})` }))}
        />
        <Select
          label="Día de la semana"
          value={form.dia_semana}
          onChange={(e) => setForm({ ...form, dia_semana: e.target.value })}
          error={errors.dia_semana}
          options={DIAS}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Hora inicio" type="time" value={form.hora_inicio} onChange={(e) => setForm({ ...form, hora_inicio: e.target.value })} error={errors.hora_inicio} />
          <Input label="Hora fin" type="time" value={form.hora_fin} onChange={(e) => setForm({ ...form, hora_fin: e.target.value })} error={errors.hora_fin} />
        </div>
        <Input label="Intervalo (minutos)" type="number" value={form.intervalo_minutos} onChange={(e) => setForm({ ...form, intervalo_minutos: e.target.value })} error={errors.intervalo_minutos} placeholder="15" />
      </CatalogoModal>
    </CatalogoLayout>
  )
}
