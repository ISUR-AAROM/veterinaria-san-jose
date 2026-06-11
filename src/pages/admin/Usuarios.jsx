import { useState, useCallback, useMemo } from 'react'
import { useUsuarios } from '../../hooks/useUsuarios'
import { useTipoDocumento } from '../../hooks/useTipoDocumento'
import { UsuarioModal } from '../../components/usuarios/UsuarioModal'
import { BarraBusqueda } from '../../components/ui/BarraBusqueda'
import { CatalogoLayout } from '../../components/catalogos/CatalogoLayout'

const ROL_COLORS = {
  ADMINISTRADOR: 'bg-purple-100 text-purple-700',
  VETERINARIO: 'bg-blue-100 text-blue-700',
  ASISTENTE: 'bg-amber-100 text-amber-700',
}

function BadgeRol({ rol }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROL_COLORS[rol] || 'bg-gray-100 text-gray-700'}`}>
      {rol}
    </span>
  )
}

export function Usuarios() {
  const { usuarios, loading, saving, error, crear, actualizar, toggleEstado, recargar, USUARIO_VACIO } = useUsuarios()
  const { tipos: tiposDocumento } = useTipoDocumento()
  const [modal, setModal] = useState({ open: false, editando: null })
  const [form, setForm] = useState(USUARIO_VACIO)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')

  const filtrados = useMemo(() => {
    let data = usuarios
    if (filtroTipo) {
      data = data.filter((u) => u.tipo === filtroTipo)
    }
    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase()
      data = data.filter((u) =>
        (u.nombre || '').toLowerCase().includes(q) ||
        (u.apellido || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      )
    }
    return data
  }, [usuarios, busqueda, filtroTipo])

  const abrirCrear = useCallback(() => {
    setForm(USUARIO_VACIO)
    setModal({ open: true, editando: null })
  }, [])

  const abrirEditar = useCallback((usuario) => {
    setForm({
      email: usuario.email,
      password: '',
      tipo: usuario.tipo,
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      telefono: usuario.telefono || '',
      id_tipo_documento: usuario.id_tipo_documento || '',
      numero_documento: usuario.numero_documento || '',
      rol: usuario.rol || 'VETERINARIO',
    })
    setModal({ open: true, editando: usuario })
  }, [])

  const guardar = useCallback(async () => {
    if (modal.editando) {
      const ok = await actualizar(modal.editando, form)
      if (ok) setModal({ open: false, editando: null })
    } else {
      const ok = await crear(form)
      if (ok) setModal({ open: false, editando: null })
    }
  }, [modal.editando, form, actualizar, crear])

  const handleToggle = useCallback(async (usuario) => {
    const accion = usuario.is_active ? 'desactivar' : 'activar'
    if (!window.confirm(`¿Estás seguro de ${accion} a ${usuario.nombre}?`)) return
    await toggleEstado(usuario.cuenta_id)
  }, [toggleEstado])

  const activos = useMemo(() => filtrados.filter((u) => u.is_active), [filtrados])
  const inactivos = useMemo(() => filtrados.filter((u) => !u.is_active), [filtrados])

  return (
    <div className="animate-fade-in-up">
      <CatalogoLayout
        titulo="Usuarios"
        descripcion="Gestión completa de clientes y personal del sistema"
        onAgregar={abrirCrear}
        botonTexto="Nuevo usuario"
        total={usuarios.length}
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <BarraBusqueda
          placeholder="Buscar por nombre, apellido o email..."
          value={busqueda}
          onChange={setBusqueda}
          filtros={[
            { label: 'Todos los tipos', value: filtroTipo, onChange: setFiltroTipo, options: [
              { value: 'CLIENTE', label: 'Cliente' },
              { value: 'PERSONAL', label: 'Personal' },
            ]},
          ]}
        />

        {loading ? (
          <div className="text-center py-12 text-sm text-[#7A6555]">Cargando usuarios...</div>
        ) : (
          <div className="space-y-8">
            <SeccionUsuarios titulo="Activos" usuarios={activos} onEditar={abrirEditar} onToggle={handleToggle} />
            {inactivos.length > 0 && (
              <SeccionUsuarios titulo="Inactivos" usuarios={inactivos} onEditar={abrirEditar} onToggle={handleToggle} />
            )}
          </div>
        )}
      </CatalogoLayout>

      <UsuarioModal
        open={modal.open}
        onClose={() => setModal({ open: false, editando: null })}
        titulo={modal.editando ? 'Editar usuario' : 'Nuevo usuario'}
        form={form}
        setForm={setForm}
        onGuardar={guardar}
        cargando={saving}
        tiposDocumento={tiposDocumento}
        editando={modal.editando}
      />
    </div>
  )
}

function SeccionUsuarios({ titulo, usuarios, onEditar, onToggle }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#2C1A0E] mb-3">{titulo}</h3>
      <div className="w-full overflow-hidden rounded-xl border border-[#E8DDD0] bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8DDD0] bg-[#FAF7F2]">
              <Th>Nombre</Th>
              <Th>Email</Th>
              <Th>Tipo</Th>
              <Th>Teléfono</Th>
              <Th>Doc. identidad</Th>
              <Th>Rol</Th>
              <Th className="text-right">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#7A6555]">
                  No hay usuarios {titulo.toLowerCase()}
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.cuenta_id} className="border-b border-[#E8DDD0] last:border-b-0 hover:bg-[#FAF7F2] transition-colors">
                  <Td>
                    <span className="font-medium text-[#2C1A0E]">{u.nombre}</span>
                    {u.apellido && <span className="text-[#7A6555] ml-1">{u.apellido}</span>}
                  </Td>
                  <Td className="text-[#7A6555]">{u.email}</Td>
                  <Td>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.tipo === 'PERSONAL'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {u.tipo === 'PERSONAL' ? 'Personal' : 'Cliente'}
                    </span>
                  </Td>
                  <Td className="text-[#7A6555]">{u.telefono || '—'}</Td>
                  <Td className="text-[#7A6555] text-xs">
                    {u.tipo_documento_nombre && (
                      <span>{u.tipo_documento_nombre}: {u.numero_documento}</span>
                    )}
                    {u.tipo === 'PERSONAL' && !u.tipo_documento_nombre && <span>—</span>}
                  </Td>
                  <Td>
                    {u.rol ? <BadgeRol rol={u.rol} /> : <span className="text-[#7A6555] text-xs">—</span>}
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditar(u)}
                        className="text-xs text-[#7A6555] hover:text-[#C2570F] transition-colors px-2 py-1 rounded hover:bg-[#FFF3EB]"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onToggle(u)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          u.is_active
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {u.is_active ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({ children, className = '' }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-semibold text-[#7A6555] uppercase tracking-wider ${className}`}>
      {children}
    </th>
  )
}

function Td({ children, className = '' }) {
  return (
    <td className={`px-4 py-3 text-sm ${className}`}>
      {children}
    </td>
  )
}
