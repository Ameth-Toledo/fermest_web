import { useEffect, useRef, useState } from "react"
import { BentoCard, BentoGrid } from "../../../../components/ui/bento-grid"

const PhChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    let raf = 0, stopped = false
    const resize = () => { canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; ctx.scale(2,2) }
    resize()
    const pH = (x: number) => 6.5 - 2.4 * Math.pow(x, 0.55) + 0.07 * Math.sin(x * 20)
    const draw = (now: number) => {
      if (stopped) return
      const W = canvas.offsetWidth, H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)
      const t = Math.min(1, (now % 6000) / 6000)
      const pad = { l: 28, r: 12, t: 10, b: 20 }
      const gW = W - pad.l - pad.r, gH = H - pad.t - pad.b
      for (let i = 0; i <= 4; i++) {
        ctx.beginPath(); ctx.moveTo(pad.l, pad.t + gH / 4 * i); ctx.lineTo(W - pad.r, pad.t + gH / 4 * i)
        ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 0.5; ctx.stroke()
      }
      ctx.beginPath()
      for (let i = 0; i <= 120; i++) {
        const rx = i / 120; if (rx > t) break
        const x = pad.l + rx * gW, y = pad.t + gH - ((pH(rx) - 4) / 2.5) * gH
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = "rgba(74,222,128,0.9)"; ctx.lineWidth = 2; ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 8; ctx.stroke(); ctx.shadowBlur = 0
      const fill = ctx.createLinearGradient(0, pad.t, 0, pad.t + gH)
      fill.addColorStop(0, "rgba(74,222,128,0.2)"); fill.addColorStop(1, "rgba(74,222,128,0)")
      ctx.beginPath()
      for (let i = 0; i <= 120; i++) {
        const rx = i / 120; if (rx > t) break
        const x = pad.l + rx * gW, y = pad.t + gH - ((pH(rx) - 4) / 2.5) * gH
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.lineTo(pad.l + t * gW, pad.t + gH); ctx.lineTo(pad.l, pad.t + gH); ctx.closePath(); ctx.fillStyle = fill; ctx.fill()
      ctx.font = "8px monospace"; ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.textAlign = "right"
      ;["6.5","5.8","5.2","4.5","4.0"].forEach((l, i) => ctx.fillText(l, pad.l - 4, pad.t + gH / 4 * i + 3))
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { stopped = true; cancelAnimationFrame(raf) }
  }, [])
  return <canvas ref={canvasRef} className="w-full h-full" />
}

const ALERTS = [
  { color: "#4ade80", icon: "✓", msg: "pH estabilizado en 4.8", time: "hace 2 min" },
  { color: "#fbbf24", icon: "⚠", msg: "Temperatura subió a 25°C", time: "hace 5 min" },
  { color: "#7dd3fc", icon: "ℹ", msg: "Lote #2024-A lleva 24h",  time: "hace 1h" },
  { color: "#a78bfa", icon: "★", msg: "Perfil de sabor alcanzado", time: "hace 3h" },
  { color: "#4ade80", icon: "✓", msg: "Fermentación completada",  time: "ayer" },
]

const AlertList = () => {
  const [visible, setVisible] = useState(1)
  useEffect(() => {
    const id = setInterval(() => setVisible(v => v < ALERTS.length ? v + 1 : 1), 1200)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex flex-col gap-2 px-3 pt-2">
      {ALERTS.slice(0, visible).map((a, i) => (
        <div key={i} className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all duration-500"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", opacity: i < visible ? 1 : 0 }}>
          <span className="text-sm w-5 text-center" style={{ color: a.color }}>{a.icon}</span>
          <span className="text-xs text-white/70 flex-1">{a.msg}</span>
          <span className="text-[10px] text-white/25 shrink-0">{a.time}</span>
        </div>
      ))}
    </div>
  )
}

const LOTES = [
  { id: "2024-A", perfil: "Frutal · Cítrico",  ph: "4.8", h: "48h", color: "#4ade80" },
  { id: "2024-B", perfil: "Floral · Dulce",     ph: "5.1", h: "36h", color: "#fbbf24" },
  { id: "2024-C", perfil: "Achocolatado",        ph: "4.6", h: "52h", color: "#7dd3fc" },
]

const LoteHistory = () => (
  <div className="flex flex-col gap-2 px-3 pt-2">
    {LOTES.map(l => (
      <div key={l.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="w-1.5 h-8 rounded-full shrink-0" style={{ background: l.color }} />
        <div className="flex flex-col gap-0.5 flex-1">
          <span className="text-xs font-bold text-white">Lote #{l.id}</span>
          <span className="text-[10px] text-white/40">{l.perfil}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-xs font-mono font-bold" style={{ color: l.color }}>pH {l.ph}</span>
          <span className="text-[10px] text-white/30">{l.h}</span>
        </div>
      </div>
    ))}
  </div>
)

const MiniGauge = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    let raf = 0, stopped = false
    const resize = () => { canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; ctx.scale(2,2) }
    resize()
    const ARCS = [
      { pct: 0.78, color: [74,222,128],  r: 0.36 },
      { pct: 0.62, color: [251,191,36],  r: 0.26 },
      { pct: 0.45, color: [125,211,252], r: 0.17 },
    ]
    const draw = (now: number) => {
      if (stopped) return
      const W = canvas.offsetWidth, H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)
      const cx = W / 2, cy = H / 2, base = Math.min(W, H) / 2
      ARCS.forEach(({ pct, color, r }, ri) => {
        const R = base * r, start = -Math.PI * 0.75, full = Math.PI * 1.5
        const animated = pct + 0.04 * Math.sin(now / 1200 + ri * 2)
        const end = start + full * animated
        const [cr, cg, cb] = color
        ctx.beginPath(); ctx.arc(cx, cy, R, start, start + full)
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.08)`; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.stroke()
        ctx.beginPath(); ctx.arc(cx, cy, R, start, end)
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.9)`; ctx.lineWidth = 7
        ctx.shadowColor = `rgba(${cr},${cg},${cb},0.6)`; ctx.shadowBlur = 10; ctx.stroke(); ctx.shadowBlur = 0
        const tx = cx + R * Math.cos(end), ty = cy + R * Math.sin(end)
        ctx.beginPath(); ctx.arc(tx, ty, 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgb(${cr},${cg},${cb})`; ctx.fill()
      })
      for (let i = 0; i < 32; i++) {
        const angle = (i / 32) * Math.PI * 2 + now / 5000
        const R1 = base * 0.43, R2 = base * 0.45
        ctx.beginPath()
        ctx.moveTo(cx + R1 * Math.cos(angle), cy + R1 * Math.sin(angle))
        ctx.lineTo(cx + R2 * Math.cos(angle), cy + R2 * Math.sin(angle))
        ctx.strokeStyle = `rgba(74,222,128,${i % 4 === 0 ? 0.4 : 0.07})`; ctx.lineWidth = 1.5; ctx.stroke()
      }
      ctx.font = "bold 10px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.textAlign = "center"; ctx.textBaseline = "middle"
      ctx.fillText("IA", cx, cy - 7)
      ctx.font = "8px monospace"; ctx.fillStyle = "rgba(74,222,128,0.6)"; ctx.fillText("LIVE", cx, cy + 8)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { stopped = true; cancelAnimationFrame(raf) }
  }, [])
  return <canvas ref={canvasRef} className="w-full h-full" />
}

const IconChart = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
const IconBell  = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const IconBox   = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
const IconCpu   = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>

const FEATURES = [
  {
    Icon: IconChart,
    name: "Monitoreo en tiempo real",
    description: "Visualiza pH y temperatura de tu fermentación segundo a segundo desde cualquier dispositivo.",
    href: "#",
    cta: "Ver demo",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 top-12 px-4 pb-4 opacity-80 transition-all duration-300 group-hover:opacity-100">
        <PhChart />
      </div>
    ),
  },
  {
    Icon: IconCpu,
    name: "IA · Algoritmo genético",
    description: "Optimización automática de parámetros para reproducir el perfil de sabor deseado.",
    href: "#",
    cta: "Conocer más",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 top-12 flex items-center justify-center opacity-70 transition-all duration-300 group-hover:opacity-100">
        <div className="w-48 h-48">
          <MiniGauge />
        </div>
      </div>
    ),
  },
  {
    Icon: IconBell,
    name: "Alertas inteligentes",
    description: "Recibe notificaciones cuando el pH sale del rango, la temperatura sube o el lote termina.",
    href: "#",
    cta: "Conocer más",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 top-14 opacity-70 transition-all duration-300 group-hover:opacity-100 [mask-image:linear-gradient(to_top,transparent_10%,#000_80%)]">
        <AlertList />
      </div>
    ),
  },
  {
    Icon: IconBox,
    name: "Historial de lotes",
    description: "Consulta cada fermentación anterior con sus parámetros, perfil y resultados completos.",
    href: "#",
    cta: "Conocer más",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 top-14 opacity-70 transition-all duration-300 group-hover:opacity-100 [mask-image:linear-gradient(to_top,transparent_10%,#000_80%)]">
        <LoteHistory />
      </div>
    ),
  },
]

const Features = () => (
  <section className="relative w-full overflow-hidden bg-bg">
    <div
      className="pointer-events-none absolute inset-0 select-none bg-size-[40px_40px]"
      style={{ backgroundImage: "linear-gradient(to right,#111 1px,transparent 1px),linear-gradient(to bottom,#111 1px,transparent 1px)" }}
    />

    <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 flex flex-col gap-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-[0.3em] text-green-500/70 font-medium">Plataforma</span>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter">
            Todo lo que necesitas
          </h2>
          <div className="w-12 h-1 rounded-full bg-green-500/40 mt-1" />
        </div>
        <p className="max-w-sm text-neutral-500 text-sm leading-relaxed md:text-right">
          Una plataforma completa para controlar, analizar y perfeccionar cada lote de fermentación.
        </p>
      </div>

      <BentoGrid className="auto-rows-[18rem]">
        {FEATURES.map((f, i) => (
          <BentoCard key={i} {...f} />
        ))}
      </BentoGrid>
    </div>
  </section>
)

export default Features
