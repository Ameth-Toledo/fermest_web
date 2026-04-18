import { CHIPS } from "./constants";

export const BioreactorChips = () => (
  <>
    {CHIPS.map(({ label, value, unit, delay, ...pos }) => (
      <div
        key={label}
        className="absolute flex flex-col gap-0.5 rounded-xl border border-white/8 px-3 py-2"
        style={{
          ...pos,
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(8px)",
          animation: `chipFloat 4s ease-in-out ${delay} infinite`,
        }}
      >
        <span className="text-[10px] uppercase tracking-wider text-neutral-500">{label}</span>
        <span className="text-base font-black text-white leading-none">
          {value}<span className="text-yellow-400 text-sm">{unit}</span>
        </span>
      </div>
    ))}
  </>
);
