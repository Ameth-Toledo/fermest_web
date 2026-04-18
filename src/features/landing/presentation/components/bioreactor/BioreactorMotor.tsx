export const BioreactorMotor = () => (
  <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 8 }}>
    <div
      className="w-14 h-14 rounded-[6px] border border-white/10 flex flex-col items-center justify-center gap-1"
      style={{
        background: "linear-gradient(145deg,#1c1c1c,#0a0a0a)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
        animation: "motorVibrate 0.15s linear infinite",
      }}
    >
      <div className="absolute -right-2 top-3 w-2 h-3 rounded-r-sm border border-white/10" style={{ background: "#111" }} />
      <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: "glowPulse 1.6s ease-in-out infinite" }} />
      <span className="text-[6px] text-white/30 font-mono tracking-widest">STEP</span>
    </div>
    <div className="mx-auto w-[4px] h-6 rounded-full" style={{ background: "rgba(220,220,220,0.8)" }} />
  </div>
);
