import { useState } from 'react'
import type { AddUserForm } from '../types/AddUserForm'
import { ROLES }                              from '../constants/roles'
import { ADD_USER_STYLES, inputStyle, labelStyle } from '../constants/addUserStyles'

const AddUserView = () => {
  const [form, setForm] = useState<AddUserForm>({
    name:       '',
    last_name:  '',
    email:      '',
    password:   '',
    confirm:    '',
    role_id:    2,
    circuit_id: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [success,      setSuccess]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)

  const set = (key: keyof AddUserForm, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const mismatch = form.confirm !== '' && form.password !== form.confirm
  const isValid  = form.name && form.last_name && form.email && form.password && form.password === form.confirm && form.role_id

  const handleSubmit = async () => {
    if (!isValid) return
    setLoading(true)
    setError(null)
    try {
      await new Promise(r => setTimeout(r, 1000))
      setSuccess(true)
      setForm({ name: '', last_name: '', email: '', password: '', confirm: '', role_id: 2, circuit_id: '' })
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Error al crear el usuario. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const EyeIcon = ({ open }: { open: boolean }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      {open
        ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
    </svg>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0B', padding: '48px' }}>
      <style>{ADD_USER_STYLES}</style>

      <div style={{ marginBottom: 40 }}>
        <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
          Gestión de Usuarios
        </p>
        <h1 style={{ color: '#F4F4F5', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
          Agregar Usuario
        </h1>
        <div style={{ marginTop: 12, height: 1, width: 96, backgroundColor: '#22C55E', opacity: 0.4 }} />
      </div>

      <div style={{ maxWidth: 640 }}>

        {success && (
          <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, backgroundColor: '#22C55E10', border: '1px solid #22C55E30', color: '#22C55E', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
            Usuario creado exitosamente.
          </div>
        )}

        {error && (
          <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, backgroundColor: '#F43F5E10', border: '1px solid #F43F5E30', color: '#F43F5E', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            {error}
          </div>
        )}

        <div style={{ padding: 28, borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22', display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Nombre</label>
              <input className="add-user-input" placeholder="Juan" value={form.name}
                onChange={e => set('name', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Apellido</label>
              <input className="add-user-input" placeholder="Pérez" value={form.last_name}
                onChange={e => set('last_name', e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Correo electrónico</label>
            <input className="add-user-input" type="email" placeholder="juan@fermest.com" value={form.email}
              onChange={e => set('email', e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input className="add-user-input" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={e => set('password', e.target.value)}
                  style={{ ...inputStyle, paddingRight: 40 }} />
                <button onClick={() => setShowPassword(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#52525B', padding: 0 }}>
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>
            <div>
              <label style={{ ...labelStyle, color: mismatch ? '#F43F5E' : '#71717A' }}>Confirmar contraseña</label>
              <div style={{ position: 'relative' }}>
                <input className="add-user-input" type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
                  value={form.confirm} onChange={e => set('confirm', e.target.value)}
                  style={{ ...inputStyle, paddingRight: 40, borderColor: mismatch ? '#F43F5E40' : '#2A2A2D' }} />
                <button onClick={() => setShowConfirm(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#52525B', padding: 0 }}>
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {mismatch && <p style={{ color: '#F43F5E', fontSize: 11, margin: '6px 0 0 2px' }}>Las contraseñas no coinciden</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Rol</label>
              <select value={form.role_id} onChange={e => set('role_id', Number(e.target.value))}
                style={{ ...inputStyle, cursor: 'pointer', colorScheme: 'dark' }}>
                {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Circuito (opcional)</label>
              <input className="add-user-input" type="number" placeholder="Ej: 3" min={1}
                value={form.circuit_id} onChange={e => set('circuit_id', e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ paddingTop: 8, borderTop: '1px solid #1F1F22' }}>
            <button
              onClick={handleSubmit}
              disabled={!isValid || loading}
              style={{
                width:           '100%',
                padding:         '12px 0',
                borderRadius:    10,
                border:          'none',
                backgroundColor: !isValid || loading ? '#16A34A40' : '#22C55E',
                color:           '#0A0A0B',
                fontSize:        13,
                fontWeight:      600,
                cursor:          !isValid || loading ? 'not-allowed' : 'pointer',
                fontFamily:      'Poppins, sans-serif',
                transition:      'background-color 0.2s',
              }}
            >
              {loading ? 'Creando usuario...' : 'Crear usuario'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddUserView
