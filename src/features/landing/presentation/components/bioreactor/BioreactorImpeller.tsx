export const BioreactorImpeller = () => (
  <div
    className="absolute left-1/2 -translate-x-1/2"
    style={{ bottom: "14%", zIndex: 11, perspective: "180px", perspectiveOrigin: "50% 50%" }}
  >
    <div style={{ transformStyle: "preserve-3d", animation: "spinImpellerFlat 1.6s linear infinite" }}>
      <svg width="120" height="120" viewBox="-60 -60 120 120">
        <ellipse cx="0" cy="-34" rx="9" ry="22" fill="rgba(30,110,65,0.95)" />
        <ellipse cx="0" cy="-34" rx="9" ry="22" fill="rgba(30,110,65,0.95)" transform="rotate(60)" />
        <ellipse cx="0" cy="-34" rx="9" ry="22" fill="rgba(30,110,65,0.95)" transform="rotate(120)" />
        <ellipse cx="0" cy="-34" rx="9" ry="22" fill="rgba(30,110,65,0.95)" transform="rotate(180)" />
        <ellipse cx="0" cy="-34" rx="9" ry="22" fill="rgba(30,110,65,0.95)" transform="rotate(240)" />
        <ellipse cx="0" cy="-34" rx="9" ry="22" fill="rgba(30,110,65,0.95)" transform="rotate(300)" />
        <circle r="12" fill="rgba(40,40,40,0.95)" />
        <circle r="6"  fill="rgba(210,210,210,0.9)" />
        <circle r="2.5" fill="rgba(70,70,70,0.95)" />
      </svg>
    </div>
  </div>
);
