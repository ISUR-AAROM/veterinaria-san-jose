import { useState, useMemo } from 'react'
import { CatalogoLayout } from '../../../components/catalogos/CatalogoLayout'
import { CatalogoModal } from '../../../components/catalogos/CatalogoModal'
import { ToggleActivoBtn } from '../../../components/catalogos/ToggleActivoBtn'
import { Badge } from '../../../components/ui/Badge'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { usePlantillas } from '../../../hooks/usePlantillas'
import { useServiciosAll } from '../../../hooks/useServiciosAll'
import { useSalas } from '../../../hooks/useSalas'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const DIA_OPTIONS = DIAS.map((d, i) => ({ value: String(i), label: d }))

const FORM_VACIO = {
  id_servicio: '',
  id_sala: '',
  dia_semana: '',
  hora_inicio: '',
  hora_fin: '',
  intervalo_minutos: '',
}

function validar(f) {
  const e = {}
  if (!f.id_servicio) e.id_servicio = 'Selecciona un servicio'
  if (!f.id_sala) e.id_sala = 'Selecciona una sala'
  if (f.dia_semana === '') e.dia_semana = 'Selecciona un día'
  if (!f.hora_inicio) e.hora_inicio = 'Requerido'
  if (!f.hora_fin) e.hora_fin = 'Requerido'
  if (f.hora_inicio && f.hora_fin && f.hora_fin <= f.hora_inicio)
    e.hora_fin = 'Debe ser después de la hora de inicio'
  if (!f.intervalo_minutos || isNaN(f.intervalo_minutos) || parseInt(f.intervalo_minutos) <= 0)
    e.intervalo_minutos = 'Ingresa un intervalo válido'
  return e
}

function EditBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7A6555] hover:bg-[#FAF7F2] hover:text-[#C2570F] transition-colors"
      title="Editar"
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M11.5 1.5L13.5 3.5L5 12L2 13L3 10L11.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M9 3L12 6" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    </button>
  )
}

export function Plantillas() {
  const { plantillas, loading, agregar, actualizar, toggleActivo } = usePlantillas()
  const { servicios } = useServiciosAll()
  const { salas } = useSalas()

  const [modal, setModal] = useState({ open: false, editando: null })
  const [form, setForm] = useState(FORM_VACIO)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const servicioOptions = useMemo(() =>
    servicios.filter((s) => s.is_active).map((s) => ({ value: s.id, label: s.nombre })),
    [servicios]
  )
  const salaOptions = useMemo(() =>
    salas.filter((s) => s.is_active).map((s) => ({ value: s.id, label: s.nombre })),
    [salas]
  )

  const abrirCrear = () => {
    setForm(FORM_VACIO)
    setErrors({})
    setModal({ open: true, editando: null })
  }

  const abrirEditar = (p) => {
    setForm({
      id_servicio: p.servicio?.id || '',
      id_sala: p.sala?.id || '',
      dia_semana: String(p.dia_semana),
      hora_inicio: p.hora_inicio,
      hora_fin: p.hora_fin,
      intervalo_minutos: String(p.intervalo_minutos),
    })
    setErrors({})
    setModal({ open: true, editando: p })
  }

  const guardar = async () => {
    const e = validar(form)
    setErrors(e)
    if (Object.keys(e).length > 0) return
    setSaving(true)
    try {
      if (modal.editando) {
        await actualizar(modal.editando.id, form)
      } else {
        await agregar(form)
      }
      setModal({ open: false, editando: null })
    } catch (err) {
      setErrors({ id_servicio: err.message })
    }
    setSaving(false)
  }

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <CatalogoLayout
      titulo="Plantillas de horario"
      descripcion="Define los horarios recurrentes por día y servicio"
      onAgregar={abrirCrear}
      total={plantillas.length}
    >
      <div className="w-full overflow-hidden rounded-xl border border-[#E8DDD0] bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-[#FAF7F2]">
              <th className="text-xs font-semibold text-[#7A6555] uppercase tracking-wide px-5 py-3.5 text-left">Servicio</th>
              <th className="text-xs font-semibold text-[#7A6555] uppercase tracking-wide px-5 py-3.5 text-left">Sala</th>
              <th className="text-xs font-semibold text-[#7A6555] uppercase tracking-wide px-5 py-3.5 text-left">Día</th>
              <th className="text-xs font-semibold text-[#7A6555] uppercase tracking-wide px-5 py-3.5 text-left">Horario</th>
              <th className="text-xs font-semibold text-[#7A6555] uppercase tracking-wide px-5 py-3.5 text-left">Intervalo</th>
              <th className="text-xs font-semibold text-[#7A6555] uppercase tracking-wide px-5 py-3.5 text-left">Estado</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-[#7A6555]">Cargando...</td></tr>
            ) : plantillas.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-[#7A6555]">Sin registros</td></tr>
            ) : plantillas.map((p) => (
              <tr key={p.id} className="border-t border-[#E8DDD0] hover:bg-[#FAF7F2] transition-colors">
                <td className="px-5 py-3.5 text-sm font-medium text-[#2C1A0E]">{p.servicio?.nombre || '—'}</td>
                <td className="px-5 py-3.5 text-sm text-[#2C1A0E]">{p.sala?.nombre || '—'}</td>
                <td className="px-5 py-3.5 text-sm text-[#2C1A0E]">{DIAS[p.dia_semana]}</td>
                <td className="px-5 py-3.5 text-sm text-[#2C1A0E]">
                  {p.hora_inicio?.slice(0, 5)} – {p.hora_fin?.slice(0, 5)}
                </td>
                <td className="px-5 py-3.5 text-sm text-[#2C1A0E]">{p.intervalo_minutos} min</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <Badge activo={p.is_active} />
                    <ToggleActivoBtn activo={p.is_active} onToggle={() => toggleActivo(p.id)} nombre="plantilla" />
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <EditBtn onClick={() => abrirEditar(p)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CatalogoModal
        open={modal.open}
        onClose={() => setModal({ open: false, editando: null })}
        titulo={modal.editando ? 'Editar plantilla' : 'Nueva plantilla'}
        onGuardar={guardar}
        cargando={saving}
      >
        <Select label="Servicio" placeholder="Seleccionar servicio" options={servicioOptions} value={form.id_servicio} onChange={handleChange('id_servicio')} error={errors.id_servicio} />
        <Select label="Sala" placeholder="Seleccionar sala" options={salaOptions} value={form.id_sala} onChange={handleChange('id_sala')} error={errors.id_sala} />
        <Select label="Día de la semana" placeholder="Seleccionar día" options={DIA_OPTIONS} value={form.dia_semana} onChange={handleChange('dia_semana')} error={errors.dia_semana} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Hora inicio" type="time" value={form.hora_inicio} onChange={handleChange('hora_inicio')} error={errors.hora_inicio} />
          <Input label="Hora fin" type="time" value={form.hora_fin} onChange={handleChange('hora_fin')} error={errors.hora_fin} />
        </div>
        <Input label="Intervalo (min)" type="number" min="1" value={form.intervalo_minutos} onChange={handleChange('intervalo_minutos')} error={errors.intervalo_minutos} placeholder="30" />
      </CatalogoModal>
    </CatalogoLayout>
  )
}
