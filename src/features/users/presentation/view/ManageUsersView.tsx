import { useState } from 'react'
import type { User }        from '../../models/entities/User'
import type { EditUserForm } from '../types/EditUserForm'
import { MANAGE_USERS_STYLES, ROLE_CONFIG } from '../constants/manageUsersStyles'

const MOCK_USERS: User[] = [
  { id: 1, name: 'Carlos',  last_name: 'Méndez',   email: 'carlos@fermest.com',  role_name: 'Administrador', circuit_id: null, created_at: '2026-01-10' },
  { id: 2, name: 'Laura',   last_name: 'Ríos',     email: 'laura@fermest.com',   role_name: 'Operador',      circuit_id: 1,    created_at: '2026-01-15' },
  { id: 3, name: 'Andrés',  last_name: 'Torres',   email: 'andres@fermest.com',  role_name: 'Operador',      circuit_id: 2,    created_at: '2026-02-03' },
  { id: 4, name: 'Sofía',   last_name: 'Vega',     email: 'sofia@fermest.com',   role_name: 'Operador',      circuit_id: 3,    created_at: '2026-02-18' },
  { id: 5, name: 'Miguel',  last_name: 'Castillo', email: 'miguel@fermest.com',  role_name: 'Administrador', circuit_id: null, created_at: '2026-03-01' },
  { id: 6, name: 'Valeria', last_name: 'Núñez',    email: 'valeria@fermest.com', role_name: 'Operador',      circuit_id: 1,    created_at: '2026-03-22' },
  { id: 7, name: 'Ricardo', last_name: 'Flores',   email: 'ricardo@fermest.com', role_name: 'Operador',      circuit_id: 2,    created_at: '2026-04-05' },
]

const inputStyle: React.CSSProperties = {
  width:           '100%',
  backgroundColor: '#0A0A0B',
  border:          '1px solid #2A2A2D',
  borderRadius:    8,
  color:           '#F4F4F5',
  fontSize:        12,
  padding:         '8px 12px',
  fontFamily:      'Poppins, sans-serif',
  boxSizing:       'border-box',
}

const ManageUsersView = () => {
  const [users, setUsers]       = useState<User[]>(MOCK_USERS)
  const [search, setSearch]     = useState('')
  const [editing, setEditing]   = useState<number | null>(null)
  const [editForm, setEditForm] = useState<EditUserForm | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [success, setSuccess]   = useState<string | null>(null)

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return (
      u.name.toLowerCase().includes(q)      ||
      u.last_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)     ||
      u.role_name.toLowerCase().includes(q)
    )
  })

  const startEdit = (u: User) => {
    setEditing(u.id)
    setEditForm({
      name:       u.name,
      last_name:  u.last_name,
      email:      u.email,
      role_name:  u.role_name,
      circuit_id: u.circuit_id !== null ? String(u.circuit_id) : '',
    })
  }

  const saveEdit = () => {
    if (!editForm || editing === null) return
    setUsers(prev => prev.map(u =>
      u.id === editing
        ? { ...u, ...editForm, circuit_id: editForm.circuit_id !== '' ? Number(editForm.circuit_id) : null }
        : u
    ))
    setEditing(null)
    setEditForm(null)
    flash('Usuario actualizado correctamente.')
  }

  const confirmDelete = () => {
    if (deleteId === null) return
    setUsers(prev => prev.filter(u => u.id !== deleteId))
    setDeleteId(null)
    flash('Usuario eliminado.')
  }

  const flash = (msg: string) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(null), 3000)
  }

  const setField = (key: keyof EditUserForm, value: string) =>
    setEditForm(prev => prev ? { ...prev, [key]: value } : prev)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0B', padding: '48px' }}>
      <style>{MANAGE_USERS_STYLES}</style>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
          Gestión de Usuarios
        </p>
        <h1 style={{ color: '#F4F4F5', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
          Administrar Usuarios
        </h1>
        <div style={{ marginTop: 12, height: 1, width: 96, backgroundColor: '#22C55E', opacity: 0.4 }} />
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32, maxWidth: 540 }}>
        {[
          { label: 'Total usuarios',  value: users.length,                                              color: '#F4F4F5' },
          { label: 'Administradores', value: users.filter(u => u.role_name === 'Administrador').length, color: '#A78BFA' },
          { label: 'Operadores',      value: users.filter(u => u.role_name === 'Operador').length,      color: '#22C55E' },
        ].map(s => (
          <div key={s.label} style={{ padding: '16px 20px', borderRadius: 14, backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
            <p style={{ color: s.color, fontSize: 26, fontWeight: 700, margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>{s.value}</p>
            <p style={{ color: '#52525B', fontSize: 11, margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Feedback */}
      {success && (
        <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, backgroundColor: '#22C55E10', border: '1px solid #22C55E30', color: '#22C55E', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
          {success}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 20, position: 'relative', maxWidth: 320 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52525B" strokeWidth="2" strokeLinecap="round"
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          className="manage-input"
          placeholder="Buscar por nombre, email o rol..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, paddingLeft: 36, paddingRight: 16 }}
        />
      </div>

      {/* Table */}
      <div style={{ borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1F1F22' }}>
              {['ID', 'Nombre', 'Email', 'Rol', 'Circuito', 'Creado', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#3F3F46', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} className="user-row"
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid #17171A' : 'none' }}>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ color: '#22C55E', fontSize: 12, fontWeight: 600, fontFamily: 'monospace' }}>#{u.id}</span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  {editing === u.id && editForm ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input className="manage-input" value={editForm.name}      onChange={e => setField('name',      e.target.value)} style={{ ...inputStyle, width: 90 }} placeholder="Nombre" />
                      <input className="manage-input" value={editForm.last_name} onChange={e => setField('last_name', e.target.value)} style={{ ...inputStyle, width: 90 }} placeholder="Apellido" />
                    </div>
                  ) : (
                    <span style={{ color: '#F4F4F5', fontSize: 13 }}>{u.name} {u.last_name}</span>
                  )}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  {editing === u.id && editForm ? (
                    <input className="manage-input" type="email" value={editForm.email} onChange={e => setField('email', e.target.value)} style={{ ...inputStyle, width: 180 }} />
                  ) : (
                    <span style={{ color: '#71717A', fontSize: 12 }}>{u.email}</span>
                  )}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  {editing === u.id && editForm ? (
                    <select value={editForm.role_name} onChange={e => setField('role_name', e.target.value)}
                      style={{ ...inputStyle, width: 140, cursor: 'pointer', colorScheme: 'dark' }}>
                      <option value="Administrador">Administrador</option>
                      <option value="Operador">Operador</option>
                    </select>
                  ) : (
                    <span style={{
                      display:         'inline-block',
                      padding:         '3px 10px',
                      borderRadius:    999,
                      fontSize:        11,
                      fontWeight:      500,
                      color:           ROLE_CONFIG[u.role_name].color,
                      backgroundColor: `${ROLE_CONFIG[u.role_name].color}15`,
                      border:          `1px solid ${ROLE_CONFIG[u.role_name].color}30`,
                    }}>
                      {u.role_name}
                    </span>
                  )}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  {editing === u.id && editForm ? (
                    <input className="manage-input" type="number" min={1} value={editForm.circuit_id} onChange={e => setField('circuit_id', e.target.value)}
                      style={{ ...inputStyle, width: 80 }} placeholder="—" />
                  ) : (
                    <span style={{ color: '#52525B', fontSize: 12, fontFamily: 'monospace' }}>
                      {u.circuit_id !== null ? `#${u.circuit_id}` : '—'}
                    </span>
                  )}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ color: '#3F3F46', fontSize: 12 }}>{u.created_at}</span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  {editing === u.id ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="action-btn" onClick={saveEdit}
                        style={{ padding: '5px 14px', borderRadius: 7, border: 'none', backgroundColor: '#22C55E', color: '#0A0A0B', fontSize: 11, fontWeight: 600, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>
                        Guardar
                      </button>
                      <button className="action-btn" onClick={() => { setEditing(null); setEditForm(null) }}
                        style={{ padding: '5px 14px', borderRadius: 7, border: '1px solid #2A2A2D', backgroundColor: 'transparent', color: '#71717A', fontSize: 11, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="action-btn" onClick={() => startEdit(u)} title="Editar"
                        style={{ background: 'none', border: 'none', padding: 4, color: '#52525B', opacity: 0.7, cursor: 'pointer' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button className="action-btn" onClick={() => setDeleteId(u.id)} title="Eliminar"
                        style={{ background: 'none', border: 'none', padding: 4, color: '#F43F5E', opacity: 0.6, cursor: 'pointer' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#3F3F46', fontSize: 13 }}>
                  No hay usuarios que coincidan con la búsqueda
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirm modal */}
      {deleteId !== null && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ padding: 32, borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22', maxWidth: 380, width: '90%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#F43F5E15', border: '1px solid #F43F5E30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                </svg>
              </div>
              <p style={{ color: '#F4F4F5', fontSize: 15, fontWeight: 600, margin: 0 }}>Eliminar usuario</p>
            </div>
            <p style={{ color: '#71717A', fontSize: 13, margin: '0 0 24px 0', lineHeight: 1.6 }}>
              ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteId(null)}
                style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #2A2A2D', backgroundColor: 'transparent', color: '#71717A', fontSize: 13, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={confirmDelete}
                style={{ padding: '8px 20px', borderRadius: 8, border: 'none', backgroundColor: '#F43F5E', color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUsersView
