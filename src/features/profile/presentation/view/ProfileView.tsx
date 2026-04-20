import { useState } from 'react'
import { userAuth } from '../../../../core/hooks/userAuth'
import { avatar as AVATARS } from '../../../../core/avatars/avatars'

const STYLES = `
  .profile-input:focus {
    outline: none;
    border-color: #22C55E !important;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.08);
  }
  .profile-input::placeholder { color: #3F3F46; }
  .avatar-option {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    cursor: pointer;
  }
  .avatar-option:hover { transform: scale(1.06); }
`

const inputStyle: React.CSSProperties = {
  width:           '100%',
  backgroundColor: '#0A0A0B',
  border:          '1px solid #2A2A2D',
  borderRadius:    10,
  color:           '#F4F4F5',
  fontSize:        13,
  padding:         '11px 14px',
  fontFamily:      'Poppins, sans-serif',
  boxSizing:       'border-box',
  transition:      'border-color 0.2s, box-shadow 0.2s',
}

const labelStyle: React.CSSProperties = {
  display:       'block',
  color:         '#71717A',
  fontSize:      10,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom:  8,
}

const readonlyStyle: React.CSSProperties = {
  ...inputStyle,
  backgroundColor: '#0D0D0F',
  border:          '1px solid #1F1F22',
  color:           '#52525B',
  cursor:          'default',
}

type InfoForm = { name: string; last_name: string; email: string }
type PasswordForm = { current: string; next: string; confirm: string }

const avatarList = Object.values(AVATARS)

// Mapea el rol que viene del backend a un label legible
const ROLE_LABELS: Record<string, string> = {
  admin:      'Administrador',
  profesor:   'Profesor',
  estudiante: 'Estudiante',
}

const ProfileView = () => {
  const { user } = userAuth()

  const savedImage = localStorage.getItem('profile_image') ?? null

  const [infoForm, setInfoForm] = useState<InfoForm>({
    name:      user?.name      ?? '',
    last_name: user?.last_name ?? '',
    email:     user?.email     ?? '',
  })
  const [pwForm,         setPwForm]         = useState<PasswordForm>({ current: '', next: '', confirm: '' })
  const [editingInfo,    setEditingInfo]    = useState(false)
  const [loadingInfo,    setLoadingInfo]    = useState(false)
  const [loadingPw,      setLoadingPw]      = useState(false)
  const [successInfo,    setSuccessInfo]    = useState(false)
  const [successPw,      setSuccessPw]      = useState(false)
  const [errorInfo,      setErrorInfo]      = useState<string | null>(null)
  const [errorPw,        setErrorPw]        = useState<string | null>(null)
  const [showCurrent,    setShowCurrent]    = useState(false)
  const [showNext,       setShowNext]       = useState(false)
  const [showConfirm,    setShowConfirm]    = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(savedImage)
  const [pickingAvatar,  setPickingAvatar]  = useState(false)

  const initials = [infoForm.name, infoForm.last_name]
    .filter(Boolean).map(s => s[0]).join('').toUpperCase() || '?'

  const pwMismatch  = pwForm.confirm !== '' && pwForm.next !== pwForm.confirm
  const pwValid     = !!(pwForm.current && pwForm.next && pwForm.next === pwForm.confirm && pwForm.next.length >= 6)
  const infoChanged = infoForm.name !== (user?.name ?? '') || infoForm.last_name !== (user?.last_name ?? '') || infoForm.email !== (user?.email ?? '')

  const setInfo = (key: keyof InfoForm, val: string) => setInfoForm(prev => ({ ...prev, [key]: val }))
  const setPw   = (key: keyof PasswordForm, val: string) => setPwForm(prev => ({ ...prev, [key]: val }))

  // Rol legible — user.role viene como "admin" | "profesor" | "estudiante"
  const roleLabel = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : '—'
  const roleColor = user?.role === 'admin' ? '#A78BFA' : user?.role === 'profesor' ? '#3B82F6' : '#22C55E'

  const handleSaveInfo = async () => {
    if (!infoChanged) return
    setLoadingInfo(true)
    setErrorInfo(null)
    try {
      // TODO: PUT /api/users/{user.id} con infoForm
      await new Promise(r => setTimeout(r, 900))
      setSuccessInfo(true)
      setEditingInfo(false)
      setTimeout(() => setSuccessInfo(false), 3000)
    } catch {
      setErrorInfo('Error al actualizar la información.')
    } finally {
      setLoadingInfo(false)
    }
  }

  const handleSavePw = async () => {
    if (!pwValid) return
    setLoadingPw(true)
    setErrorPw(null)
    try {
      // TODO: PUT /api/users/{user.id}/password con pwForm
      await new Promise(r => setTimeout(r, 900))
      setSuccessPw(true)
      setPwForm({ current: '', next: '', confirm: '' })
      setTimeout(() => setSuccessPw(false), 3000)
    } catch {
      setErrorPw('Error al cambiar la contraseña.')
    } finally {
      setLoadingPw(false)
    }
  }

  const handleSelectAvatar = (path: string) => {
    setSelectedAvatar(path)
    localStorage.setItem('profile_image', path)
    setPickingAvatar(false)
    // TODO: PUT /api/users/{user.id} con { profile_image: path }
  }

  const EyeBtn = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button type="button" onClick={onToggle}
      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#52525B', padding: 0 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        {show
          ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
          : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
      </svg>
    </button>
  )

  const Flash = ({ msg, type }: { msg: string; type: 'success' | 'error' }) => {
    const ok = type === 'success'
    return (
      <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, backgroundColor: ok ? '#22C55E10' : '#F43F5E10', border: `1px solid ${ok ? '#22C55E30' : '#F43F5E30'}`, color: ok ? '#22C55E' : '#F43F5E', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
        {ok
          ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
          : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
        {msg}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0B', padding: '48px' }}>
      <style>{STYLES}</style>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Cuenta</p>
        <h1 style={{ color: '#F4F4F5', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Mi Perfil</h1>
        <div style={{ marginTop: 12, height: 1, width: 96, backgroundColor: '#22C55E', opacity: 0.4 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, maxWidth: 860, alignItems: 'start' }}>

        {/* ── Columna izquierda ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Avatar card */}
          <div style={{ padding: 28, borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              {selectedAvatar ? (
                <img src={selectedAvatar} alt="Avatar"
                  style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'contain', border: '2px solid #22C55E30', backgroundColor: '#FFFFFF' }} />
              ) : (
                <div style={{ width: 88, height: 88, borderRadius: '50%', backgroundColor: '#16A34A22', border: '2px solid #22C55E30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: '#22C55E', letterSpacing: '-0.02em' }}>
                  {initials}
                </div>
              )}
              <button onClick={() => setPickingAvatar(p => !p)} title="Cambiar avatar"
                style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', backgroundColor: '#22C55E', border: '2px solid #0A0A0B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#F4F4F5', fontSize: 15, fontWeight: 600, margin: '0 0 4px 0' }}>
                {infoForm.name} {infoForm.last_name}
              </p>
              <p style={{ color: '#52525B', fontSize: 12, margin: 0 }}>{infoForm.email}</p>
            </div>

            {pickingAvatar && (
              <div style={{ width: '100%', borderTop: '1px solid #1F1F22', paddingTop: 16 }}>
                <p style={{ color: '#3F3F46', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
                  Elige un avatar
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {avatarList.map(path => (
                    <button key={path} className="avatar-option" onClick={() => handleSelectAvatar(path)}
                      style={{ padding: 0, background: 'none', border: `2px solid ${selectedAvatar === path ? '#22C55E' : '#1F1F22'}`, borderRadius: '50%', cursor: 'pointer', boxShadow: selectedAvatar === path ? '0 0 0 3px rgba(34,197,94,0.2)' : 'none' }}>
                      <img src={path} alt="avatar"
                        style={{ width: '100%', aspectRatio: '1', borderRadius: '50%', objectFit: 'contain', display: 'block', backgroundColor: '#FFFFFF' }} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Info de cuenta (solo lectura) */}
          <div style={{ padding: 24, borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ color: '#3F3F46', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
              Información de cuenta
            </p>
            {[
              {
                label: 'Rol',
                // user.role viene como "admin" | "profesor" | "estudiante" desde el backend
                value: roleLabel,
                color: roleColor,
              },
              {
                label: 'Circuito',
                value: user?.circuit_id ? `#${user.circuit_id}` : '—',
                color: '#A1A1AA',
              },
              {
                label: 'ID de usuario',
                // created_at no viene en el login response — mostramos el ID como alternativa útil
                value: user?.id ? `#${user.id}` : '—',
                color: '#A1A1AA',
              },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #17171A' }}>
                <span style={{ color: '#52525B', fontSize: 11 }}>{item.label}</span>
                <span style={{ color: item.color, fontSize: 12, fontWeight: 500, fontFamily: 'monospace' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Columna derecha ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Info personal */}
          <div style={{ padding: 28, borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <p style={{ color: '#F4F4F5', fontSize: 14, fontWeight: 600, margin: 0 }}>Información personal</p>
              {!editingInfo && (
                <button onClick={() => setEditingInfo(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: '1px solid #2A2A2D', backgroundColor: 'transparent', color: '#71717A', fontSize: 12, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Editar
                </button>
              )}
            </div>

            {successInfo && <Flash msg="Información actualizada correctamente." type="success" />}
            {errorInfo   && <Flash msg={errorInfo} type="error" />}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Nombre</label>
                  <input className="profile-input" value={infoForm.name}
                    onChange={e => setInfo('name', e.target.value)}
                    disabled={!editingInfo} style={editingInfo ? inputStyle : readonlyStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Apellido</label>
                  <input className="profile-input" value={infoForm.last_name}
                    onChange={e => setInfo('last_name', e.target.value)}
                    disabled={!editingInfo} style={editingInfo ? inputStyle : readonlyStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Correo electrónico</label>
                <input className="profile-input" type="email" value={infoForm.email}
                  onChange={e => setInfo('email', e.target.value)}
                  disabled={!editingInfo} style={editingInfo ? inputStyle : readonlyStyle} />
              </div>

              {editingInfo && (
                <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                  <button onClick={handleSaveInfo} disabled={!infoChanged || loadingInfo}
                    style={{ padding: '10px 24px', borderRadius: 10, border: 'none', backgroundColor: !infoChanged || loadingInfo ? '#16A34A40' : '#22C55E', color: '#0A0A0B', fontSize: 13, fontWeight: 600, cursor: !infoChanged || loadingInfo ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif', transition: 'background-color 0.2s' }}>
                    {loadingInfo ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  <button onClick={() => { setEditingInfo(false); setInfoForm({ name: user?.name ?? '', last_name: user?.last_name ?? '', email: user?.email ?? '' }); setErrorInfo(null) }}
                    style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #2A2A2D', backgroundColor: 'transparent', color: '#71717A', fontSize: 13, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cambiar contraseña */}
          <div style={{ padding: 28, borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
            <p style={{ color: '#F4F4F5', fontSize: 14, fontWeight: 600, margin: '0 0 24px 0' }}>Cambiar contraseña</p>

            {successPw && <Flash msg="Contraseña actualizada correctamente." type="success" />}
            {errorPw   && <Flash msg={errorPw} type="error" />}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle}>Contraseña actual</label>
                <div style={{ position: 'relative' }}>
                  <input className="profile-input" type={showCurrent ? 'text' : 'password'} placeholder="••••••••"
                    value={pwForm.current} onChange={e => setPw('current', e.target.value)}
                    style={{ ...inputStyle, paddingRight: 40 }} />
                  <EyeBtn show={showCurrent} onToggle={() => setShowCurrent(p => !p)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Nueva contraseña</label>
                  <div style={{ position: 'relative' }}>
                    <input className="profile-input" type={showNext ? 'text' : 'password'} placeholder="••••••••"
                      value={pwForm.next} onChange={e => setPw('next', e.target.value)}
                      style={{ ...inputStyle, paddingRight: 40 }} />
                    <EyeBtn show={showNext} onToggle={() => setShowNext(p => !p)} />
                  </div>
                  {pwForm.next !== '' && pwForm.next.length < 6 && (
                    <p style={{ color: '#F59E0B', fontSize: 11, margin: '6px 0 0 2px' }}>Mínimo 6 caracteres</p>
                  )}
                </div>
                <div>
                  <label style={{ ...labelStyle, color: pwMismatch ? '#F43F5E' : '#71717A' }}>Confirmar nueva</label>
                  <div style={{ position: 'relative' }}>
                    <input className="profile-input" type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
                      value={pwForm.confirm} onChange={e => setPw('confirm', e.target.value)}
                      style={{ ...inputStyle, paddingRight: 40, borderColor: pwMismatch ? '#F43F5E40' : '#2A2A2D' }} />
                    <EyeBtn show={showConfirm} onToggle={() => setShowConfirm(p => !p)} />
                  </div>
                  {pwMismatch && <p style={{ color: '#F43F5E', fontSize: 11, margin: '6px 0 0 2px' }}>Las contraseñas no coinciden</p>}
                </div>
              </div>

              <div style={{ paddingTop: 4 }}>
                <button onClick={handleSavePw} disabled={!pwValid || loadingPw}
                  style={{ padding: '10px 24px', borderRadius: 10, border: 'none', backgroundColor: !pwValid || loadingPw ? '#16A34A40' : '#22C55E', color: '#0A0A0B', fontSize: 13, fontWeight: 600, cursor: !pwValid || loadingPw ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif', transition: 'background-color 0.2s' }}>
                  {loadingPw ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfileView