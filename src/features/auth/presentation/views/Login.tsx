import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLoginViewModel } from '../viewmodels/useLoginViewModel'
import { cn } from '../../../../lib/utils'
import Text3DFlip from '../../../../components/ui/text-3d-flip'
import { BentoCard, BentoGrid } from '../../../../components/ui/bento-grid'

const PhChart = () => {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    let raf = 0, stopped = false
    const resize = () => { c.width = c.offsetWidth * 2; c.height = c.offsetHeight * 2; ctx.scale(2,2) }
    resize()
    const pH = (x: number) => 6.5 - 2.4 * Math.pow(x, 0.55) + 0.07 * Math.sin(x * 20)
    const draw = (now: number) => {
      if (stopped) return
      const W = c.offsetWidth, H = c.offsetHeight
      ctx.clearRect(0,0,W,H)
      const t = Math.min(1, (now % 6000) / 6000)
      const pad = { l:28, r:12, t:10, b:20 }
      const gW = W-pad.l-pad.r, gH = H-pad.t-pad.b
      for (let i=0;i<=4;i++){
        ctx.beginPath(); ctx.moveTo(pad.l, pad.t+gH/4*i); ctx.lineTo(W-pad.r, pad.t+gH/4*i)
        ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=0.5; ctx.stroke()
      }
      ctx.beginPath()
      for (let i=0;i<=120;i++){
        const rx=i/120; if(rx>t) break
        const x=pad.l+rx*gW, y=pad.t+gH-((pH(rx)-4)/2.5)*gH
        i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
      }
      ctx.strokeStyle='rgba(74,222,128,0.9)'; ctx.lineWidth=2; ctx.shadowColor='#4ade80'; ctx.shadowBlur=8; ctx.stroke(); ctx.shadowBlur=0
      const fill=ctx.createLinearGradient(0,pad.t,0,pad.t+gH)
      fill.addColorStop(0,'rgba(74,222,128,0.2)'); fill.addColorStop(1,'rgba(74,222,128,0)')
      ctx.beginPath()
      for (let i=0;i<=120;i++){
        const rx=i/120; if(rx>t) break
        const x=pad.l+rx*gW, y=pad.t+gH-((pH(rx)-4)/2.5)*gH
        i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
      }
      ctx.lineTo(pad.l+t*gW,pad.t+gH); ctx.lineTo(pad.l,pad.t+gH); ctx.closePath(); ctx.fillStyle=fill; ctx.fill()
      ctx.font='8px monospace'; ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.textAlign='right'
      ;['6.5','5.8','5.2','4.5','4.0'].forEach((l,i)=>ctx.fillText(l,pad.l-4,pad.t+gH/4*i+3))
      raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return ()=>{ stopped=true; cancelAnimationFrame(raf) }
  },[])
  return <canvas ref={ref} className="w-full h-full" />
}

const AIGaugeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    let raf = 0, stopped = false
    const dpr = Math.min(window.devicePixelRatio||1,2)
    const resize = () => {
      const {width,height}=canvas.getBoundingClientRect()
      canvas.width=width*dpr; canvas.height=height*dpr
      ctx.setTransform(dpr,0,0,dpr,0,0)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas); resize()
    const RINGS = [
      {label:'pH', min:4.0, max:6.5, value:5.12, color:[74,222,128],  r:0.38, width:10},
      {label:'°C', min:18,  max:26,  value:22.4,  color:[251,191,36], r:0.27, width:8 },
      {label:'%CO₂',min:0, max:100, value:67,    color:[125,211,252], r:0.17, width:6 },
    ]
    const draw = (now: number) => {
      if (stopped) return
      const W=canvas.getBoundingClientRect().width, H=canvas.getBoundingClientRect().height
      ctx.clearRect(0,0,W,H)
      const cx=W/2, cy=H/2, base=Math.min(W,H)/2, t=now/1000
      RINGS.forEach((ring,ri)=>{
        const R=base*ring.r, startAngle=-Math.PI*0.75, fullAngle=Math.PI*1.5
        const pct=(ring.value-ring.min)/(ring.max-ring.min)
        const animated=pct+0.03*Math.sin(t*0.7+ri*2.1)
        const endAngle=startAngle+fullAngle*Math.max(0,Math.min(1,animated))
        const [r,g,b]=ring.color
        ctx.beginPath(); ctx.arc(cx,cy,R,startAngle,startAngle+fullAngle)
        ctx.strokeStyle=`rgba(${r},${g},${b},0.08)`; ctx.lineWidth=ring.width; ctx.lineCap='round'; ctx.stroke()
        ctx.beginPath(); ctx.arc(cx,cy,R,startAngle,endAngle)
        ctx.strokeStyle=`rgba(${r},${g},${b},0.18)`; ctx.lineWidth=ring.width+6; ctx.lineCap='round'; ctx.stroke()
        ctx.beginPath(); ctx.arc(cx,cy,R,startAngle,endAngle)
        ctx.strokeStyle=`rgba(${r},${g},${b},0.95)`; ctx.lineWidth=ring.width; ctx.lineCap='round'; ctx.stroke()
        const tipX=cx+R*Math.cos(endAngle), tipY=cy+R*Math.sin(endAngle)
        const pulse=0.6+0.4*Math.sin(t*3+ri)
        const dg=ctx.createRadialGradient(tipX,tipY,0,tipX,tipY,ring.width*2)
        dg.addColorStop(0,`rgba(${r},${g},${b},${pulse})`); dg.addColorStop(1,`rgba(${r},${g},${b},0)`)
        ctx.beginPath(); ctx.arc(tipX,tipY,ring.width*2,0,Math.PI*2); ctx.fillStyle=dg; ctx.fill()
        ctx.beginPath(); ctx.arc(tipX,tipY,ring.width/2,0,Math.PI*2); ctx.fillStyle=`rgba(255,255,255,${pulse})`; ctx.fill()
        const lx=cx+(R+ring.width*2.5)*Math.cos(-Math.PI*0.75), ly=cy+(R+ring.width*2.5)*Math.sin(-Math.PI*0.75)
        ctx.font=`bold ${ring.width-1}px monospace`; ctx.fillStyle=`rgba(${r},${g},${b},0.7)`
        ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(ring.label,lx,ly)
      })
      const mainPulse=0.8+0.2*Math.sin(t*1.5)
      const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,base*0.10)
      cg.addColorStop(0,`rgba(74,222,128,${0.2*mainPulse})`); cg.addColorStop(1,'rgba(74,222,128,0)')
      ctx.beginPath(); ctx.arc(cx,cy,base*0.10,0,Math.PI*2); ctx.fillStyle=cg; ctx.fill()
      ctx.font='bold 11px sans-serif'; ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.fillText('AI',cx,cy-8)
      ctx.font='bold 9px monospace'; ctx.fillStyle='rgba(74,222,128,0.6)'; ctx.fillText('LIVE',cx,cy+8)
      for(let i=0;i<36;i++){
        const angle=(i/36)*Math.PI*2+t*0.2
        const i1=base*0.44, o1=base*0.46
        const x1=cx+i1*Math.cos(angle), y1=cy+i1*Math.sin(angle)
        const x2=cx+o1*Math.cos(angle), y2=cy+o1*Math.sin(angle)
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2)
        ctx.strokeStyle=`rgba(74,222,128,${i%3===0?0.35:0.08})`; ctx.lineWidth=1.5; ctx.stroke()
      }
      raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return ()=>{ stopped=true; cancelAnimationFrame(raf); ro.disconnect() }
  },[])
  return <canvas ref={canvasRef} className="w-full h-full" />
}

const ALERTS = [
  {color:'#4ade80', icon:'✓', msg:'pH estabilizado en 4.8', time:'hace 2 min'},
  {color:'#fbbf24', icon:'⚠', msg:'Temperatura subió a 25°C', time:'hace 5 min'},
  {color:'#7dd3fc', icon:'ℹ', msg:'Lote #2024-A lleva 24h',  time:'hace 1h'},
  {color:'#a78bfa', icon:'★', msg:'Perfil de sabor alcanzado', time:'hace 3h'},
  {color:'#4ade80', icon:'✓', msg:'Fermentación completada',  time:'ayer'},
]
const AlertList = () => {
  const [visible,setVisible] = useState(1)
  useEffect(()=>{
    const id=setInterval(()=>setVisible(v=>v<ALERTS.length?v+1:1),1200)
    return ()=>clearInterval(id)
  },[])
  return (
    <div className="flex flex-col gap-2 px-3 pt-2">
      {ALERTS.slice(0,visible).map((a,i)=>(
        <div key={i} className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all duration-500"
          style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',opacity:i<visible?1:0}}>
          <span className="text-sm w-5 text-center" style={{color:a.color}}>{a.icon}</span>
          <span className="text-xs text-white/70 flex-1">{a.msg}</span>
          <span className="text-[10px] text-white/25 shrink-0">{a.time}</span>
        </div>
      ))}
    </div>
  )
}

const LOTES = [
  {id:'2024-A', perfil:'Frutal · Cítrico', ph:'4.8', h:'48h', color:'#4ade80'},
  {id:'2024-B', perfil:'Floral · Dulce',   ph:'5.1', h:'36h', color:'#fbbf24'},
  {id:'2024-C', perfil:'Achocolatado',      ph:'4.6', h:'52h', color:'#7dd3fc'},
]
const LoteHistory = () => (
  <div className="flex flex-col gap-2 px-3 pt-2">
    {LOTES.map(l=>(
      <div key={l.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5"
        style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
        <div className="w-1.5 h-8 rounded-full shrink-0" style={{background:l.color}} />
        <div className="flex flex-col gap-0.5 flex-1">
          <span className="text-xs font-bold text-white">Lote #{l.id}</span>
          <span className="text-[10px] text-white/40">{l.perfil}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-xs font-mono font-bold" style={{color:l.color}}>pH {l.ph}</span>
          <span className="text-[10px] text-white/30">{l.h}</span>
        </div>
      </div>
    ))}
  </div>
)

const IconChart = ({className}:{className?:string}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
const IconCpu   = ({className}:{className?:string}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
const IconBell  = ({className}:{className?:string}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const IconBox   = ({className}:{className?:string}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>

const FEATURES = [
  {
    Icon: IconChart,
    name: 'Monitoreo en tiempo real',
    description: 'Visualiza pH y temperatura de tu fermentación segundo a segundo.',
    href: '#',
    cta: 'Ver demo',
    className: 'col-span-3 lg:col-span-2',
    background: (
      <div className="absolute inset-0 top-10 px-4 opacity-75 transition-all duration-300 group-hover:opacity-100 [mask-image:linear-gradient(to_top,transparent_38%,#000_65%)]">
        <PhChart />
      </div>
    ),
  },
  {
    Icon: IconCpu,
    name: 'IA · Algoritmo genético',
    description: 'Optimización automática para reproducir el perfil de sabor deseado.',
    href: '#',
    cta: 'Conocer más',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <div className="absolute inset-0 flex items-start justify-center pt-6 opacity-70 transition-all duration-300 group-hover:opacity-100 [mask-image:linear-gradient(to_top,transparent_38%,#000_65%)]">
        <div className="w-28 h-28">
          <AIGaugeCanvas />
        </div>
      </div>
    ),
  },
  {
    Icon: IconBell,
    name: 'Alertas inteligentes',
    description: 'Notificaciones cuando el pH sale del rango o la temperatura sube.',
    href: '#',
    cta: 'Conocer más',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <div className="absolute inset-0 top-8 opacity-70 transition-all duration-300 group-hover:opacity-100 [mask-image:linear-gradient(to_top,transparent_38%,#000_65%)]">
        <AlertList />
      </div>
    ),
  },
  {
    Icon: IconBox,
    name: 'Historial de lotes',
    description: 'Consulta cada fermentación anterior con parámetros y perfil completo.',
    href: '#',
    cta: 'Conocer más',
    className: 'col-span-3 lg:col-span-2',
    background: (
      <div className="absolute inset-0 top-8 opacity-70 transition-all duration-300 group-hover:opacity-100 [mask-image:linear-gradient(to_top,transparent_38%,#000_65%)]">
        <LoteHistory />
      </div>
    ),
  },
]

const Login = () => {
  const { email, setEmail, password, setPassword, loading, error, handleSubmit } = useLoginViewModel()
  const [showPass, setShowPass] = useState(false)

  return (
    <div className="min-h-screen w-full flex bg-[#0A0A0B]">

      <div className="flex-1 flex flex-col justify-center px-12 py-16 max-w-xl">

        <div className="flex items-center gap-2.5 mb-12">
          <img src="/assets/logo.svg" alt="Fermest" className="w-8 h-8 object-contain" />
          <span className="text-white font-bold text-lg tracking-tight">Fermest</span>
        </div>

        <div className="flex flex-col gap-3 mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight">¡Bienvenido de nuevo!</h1>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
            Monitorea y optimiza la fermentación de tu café con inteligencia artificial en tiempo real.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-neutral-400 font-medium">Correo electrónico</label>
            <input
              type="email" required autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-neutral-600 bg-neutral-900 border border-neutral-800 outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm text-neutral-400 font-medium">Contraseña</label>
              <a href="#" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">¿Olvidaste tu contraseña?</a>
            </div>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} required autoComplete="current-password"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg px-4 py-3 pr-11 text-sm text-white placeholder:text-neutral-600 bg-neutral-900 border border-neutral-800 outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 transition-all duration-200"
              />
              <button type="button" onClick={() => setShowPass(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors">
                {showPass
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-red-400 bg-red-950/40 border border-red-500/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className={cn('w-full rounded-lg py-3 text-sm font-semibold text-black mt-1 transition-all duration-200 bg-white hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed')}>
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  Iniciando sesión...
                </span>
              : 'Iniciar sesión'
            }
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-neutral-600 text-xs">o</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="flex items-center justify-center gap-2.5 rounded-lg py-3 text-sm font-medium text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 transition-all duration-200">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button type="button" className="flex items-center justify-center gap-2.5 rounded-lg py-3 text-sm font-medium text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 transition-all duration-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            GitHub
          </button>
        </div>

        <p className="text-center text-sm text-neutral-600 mt-8">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-white hover:text-neutral-200 font-medium transition-colors">Regístrate</Link>
        </p>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0" style={{background:'linear-gradient(135deg,#0a1a0f 0%,#0f2d1a 30%,#1a4a2a 60%,#2d6b3f 100%)'}} />
        <div className="absolute inset-0" style={{background:'radial-gradient(ellipse 80% 60% at 60% 40%,rgba(15,142,77,0.35),transparent 70%)'}} />
        <div className="absolute inset-0" style={{background:'radial-gradient(ellipse 50% 50% at 30% 70%,rgba(74,222,128,0.12),transparent 60%)'}} />
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:'linear-gradient(to right,rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.05) 1px,transparent 1px)',backgroundSize:'40px 40px'}} />

        <div className="absolute inset-0 flex flex-col gap-6 px-8 py-10 overflow-y-auto">

          <div className="flex items-center gap-3 shrink-0">
            <img src="/assets/logo.svg" alt="Fermest" className="w-10 h-10 object-contain shrink-0" />
            <Text3DFlip
              className="bg-transparent justify-start"
              textClassName="bg-transparent bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent text-2xl font-black leading-tight tracking-tighter"
              flipTextClassName="bg-transparent bg-linear-to-b from-white/50 to-white/20 bg-clip-text text-transparent text-2xl font-black leading-tight tracking-tighter"
              rotateDirection="top"
              staggerDuration={0.03}
              staggerFrom="first"
              transition={{type:'spring', damping:25, stiffness:160}}
            >
              Fermentación de café inteligente
            </Text3DFlip>
          </div>

          <BentoGrid className="auto-rows-[13rem]">
            {FEATURES.map((f,i) => (
              <BentoCard key={i} {...f} />
            ))}
          </BentoGrid>

        </div>
      </div>

    </div>
  )
}

export default Login
