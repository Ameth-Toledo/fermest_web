import { BioreactorImpeller } from "./BioreactorImpeller";
import { BUBBLES, CONDENSATION, PULSE_RINGS } from "./constants";

export const BioreactorCylinder = () => (
  <div
    className="absolute left-1/2 -translate-x-1/2 overflow-hidden"
    style={{
      top: 112,
      width: 152,
      height: 272,
      borderRadius: "4px 4px 8px 8px",
      border: "1px solid rgba(255,255,255,0.18)",
      background: "rgba(255,255,255,0.03)",
      boxShadow: "inset 2px 0 8px rgba(255,255,255,0.04), inset -2px 0 8px rgba(255,255,255,0.04)",
    }}
  >
    <div className="absolute bottom-0 left-0 right-0 h-[78%]">
      <div
        className="absolute -top-3 left-0 w-[200%]"
        style={{ animation: "waveScroll 3s linear infinite" }}
      >
        <svg width="576" height="24" viewBox="0 0 576 24" preserveAspectRatio="none">
          <path
            d="M0,12 C24,0 48,24 72,12 C96,0 120,24 144,12 C168,0 192,24 216,12 C240,0 264,24 288,12 C312,0 336,24 360,12 C384,0 408,24 432,12 C456,0 480,24 504,12 C528,0 552,24 576,12 L576,24 L0,24 Z"
            fill="rgba(234,179,8,0.3)"
          />
        </svg>
      </div>
      <div
        className="absolute inset-0 top-5"
        style={{ background: "linear-gradient(180deg,rgba(234,179,8,0.13) 0%,rgba(234,179,8,0.24) 100%)" }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-12 blur-xl rounded-full"
        style={{ background: "rgba(234,179,8,0.2)" }}
      />
      {BUBBLES.map((b, i) => (
        <div
          key={i}
          className="absolute bottom-6 rounded-full"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            background: "rgba(234,179,8,0.25)",
            border: "1px solid rgba(234,179,8,0.4)",
            animation: `bubbleRise ${b.duration} ease-in ${b.delay} infinite`,
          }}
        />
      ))}
    </div>

    <div
      className="absolute left-1/2 -translate-x-1/2 top-0 w-[4px]"
      style={{ height: "64%", background: "rgba(230,230,230,0.9)", zIndex: 10 }}
    />

    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        top: "57%",
        left: "50%",
        width: 90,
        height: 90,
        transform: "translate(-50%,-50%)",
        background: "conic-gradient(from 0deg, rgba(234,179,8,0.2), transparent 45%, rgba(234,179,8,0.12), transparent 85%)",
        animation: "vortexSpin 2s linear infinite",
        zIndex: 9,
      }}
    />

    {PULSE_RINGS.map((r, i) => (
      <div
        key={i}
        className="absolute rounded-full border pointer-events-none"
        style={{
          top: "64%",
          left: "50%",
          width: 44,
          height: 44,
          transform: "translate(-50%,-50%)",
          borderColor: "rgba(234,179,8,0.7)",
          animation: `impellerPulse 1.6s ease-out ${r.delay} infinite`,
          zIndex: 9,
        }}
      />
    ))}

    <BioreactorImpeller />

    {CONDENSATION.map((d, i) => (
      <div
        key={i}
        className="absolute w-[2px] rounded-full pointer-events-none"
        style={{
          left: d.left,
          background: "linear-gradient(180deg,rgba(255,255,255,0.35),transparent)",
          animation: `dropSlide ${d.duration} linear ${d.delay} infinite`,
          zIndex: 15,
        }}
      />
    ))}

    <div
      className="absolute left-0 right-0 h-[1px] pointer-events-none"
      style={{
        background: "linear-gradient(90deg,transparent,rgba(234,179,8,0.25),transparent)",
        animation: "scanLine 5s ease-in-out infinite",
        zIndex: 16,
      }}
    />

    <div
      className="absolute top-6 left-2 w-[3px] h-40 rounded-full"
      style={{ background: "linear-gradient(180deg,rgba(255,255,255,0.14),transparent)" }}
    />
  </div>
);
