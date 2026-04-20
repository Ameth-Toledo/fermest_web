import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useRegisterViewModel } from '../viewmodels/useRegisterViewModel'
import { BlurFade } from '../../../../components/ui/blur-fade'
import { cn } from '../../../../lib/utils'

const COL1 = [
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
  'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=600&q=80',
  'https://images.unsplash.com/photo-1611077543764-4b6a1fe68b25?w=600&q=80',
]
const COL2 = [
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80',
  'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=600&q=80',
  'https://images.unsplash.com/photo-1559525839-8c4c01c1dee2?w=600&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80',
]

const EyeIcon = ({ open }: { open: boolean }) => open
  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>

const Register = () => {
  const {
    name,      setName,
    lastName,  setLastName,
    email,     setEmail,
    password,  setPassword,
    confirm,   setConfirm,
    loading,
    error,
    handleSubmit,
  } = useRegisterViewModel()

  const [showPass, setShowPass]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const inputBase = cn(
    'w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-neutral-600',
    'bg-neutral-900 border border-neutral-800 outline-none',
    'focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 transition-all duration-200'
  )
  const labelBase = 'text-sm text-neutral-400 font-medium'

  return (
    <div className="min-h-screen w-full flex bg-[#0A0A0B]">

      {/* ── Form side ── */}
      <div className="flex-1 flex flex-col justify-center px-12 py-12 max-w-xl overflow-y-auto">

        <BlurFade delay={0} duration={0.4} direction="up">
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <img src="/assets/logo.svg" alt="Fermest" className="w-8 h-8 object-contain cursor-pointer" />
            <span className="text-white font-bold text-lg tracking-tight">Fermest</span>
          </Link>
        </BlurFade>

        <BlurFade delay={0.08} duration={0.4} direction="up">
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-4xl font-black text-white tracking-tight">Crea tu cuenta</h1>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
              Empieza a monitorear y optimizar la fermentación de tu café con IA.
            </p>
          </div>
        </BlurFade>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Nombre + Apellido */}
          <BlurFade delay={0.14} duration={0.4} direction="up">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={labelBase}>Nombre</label>
                <input
                  type="text" required autoComplete="given-name"
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className={inputBase}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelBase}>Apellido</label>
                <input
                  type="text" required autoComplete="family-name"
                  value={lastName} onChange={e => setLastName(e.target.value)}
                  placeholder="Tu apellido"
                  className={inputBase}
                />
              </div>
            </div>
          </BlurFade>

          {/* Email */}
          <BlurFade delay={0.20} duration={0.4} direction="up">
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>Correo electrónico</label>
              <input
                type="email" required autoComplete="email"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className={inputBase}
              />
            </div>
          </BlurFade>

          {/* Contraseña */}
          <BlurFade delay={0.26} duration={0.4} direction="up">
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required autoComplete="new-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(inputBase, 'pr-11')}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors">
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>
          </BlurFade>

          {/* Confirmar contraseña */}
          <BlurFade delay={0.32} duration={0.4} direction="up">
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>Confirmar contraseña</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'} required autoComplete="new-password"
                  value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    inputBase, 'pr-11',
                    confirm && password !== confirm
                      ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20'
                      : ''
                  )}
                />
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors">
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {confirm && password !== confirm && (
                <span className="text-xs text-red-400 mt-0.5">Las contraseñas no coinciden</span>
              )}
            </div>
          </BlurFade>

          {/* Error */}
          {error && (
            <BlurFade delay={0} duration={0.3} direction="up">
              <div className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-red-400 bg-red-950/40 border border-red-500/20">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            </BlurFade>
          )}

          {/* Submit */}
          <BlurFade delay={0.38} duration={0.4} direction="up">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 text-sm font-semibold text-black mt-1 transition-all duration-200 bg-white hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Creando cuenta...
                  </span>
                : 'Crear cuenta'
              }
            </button>
          </BlurFade>
        </form>

        <BlurFade delay={0.44} duration={0.4} direction="up">
          <p className="text-center text-sm text-neutral-600 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-white hover:text-neutral-200 font-medium transition-colors">
              Inicia sesión
            </Link>
          </p>
        </BlurFade>
      </div>

      {/* ── Image side ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <style>{`
          @keyframes scrollDown { from { transform: translateY(-50%); } to { transform: translateY(0%); } }
          @keyframes scrollUp   { from { transform: translateY(0%);   } to { transform: translateY(-50%); } }
        `}</style>

        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#0a1a0f 0%,#0f2d1a 30%,#1a4a2a 60%,#2d6b3f 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(15,142,77,0.25),transparent 70%)' }} />

        <div className="absolute inset-0 flex gap-3 px-6 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <div style={{ animation: 'scrollDown 22s linear infinite' }}>
              {[...COL1, ...COL1].map((src, i) => (
                <div key={i} className="mb-3 rounded-xl overflow-hidden">
                  <img src={src} alt="" className="w-full object-cover rounded-xl" style={{ filter: 'brightness(0.65) saturate(0.8)' }} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div style={{ animation: 'scrollUp 26s linear infinite' }}>
              {[...COL2, ...COL2].map((src, i) => (
                <div key={i} className="mb-3 rounded-xl overflow-hidden">
                  <img src={src} alt="" className="w-full object-cover rounded-xl" style={{ filter: 'brightness(0.65) saturate(0.8)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom,#0a1a0f,transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to top,#0a1a0f,transparent)' }} />
      </div>
    </div>
  )
}

export default Register