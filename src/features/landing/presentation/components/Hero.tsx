import { cn } from "../../../../lib/utils";
import { Spotlight } from "./ui/Spotlight";

const Hero = () => {
  return (
    <section className="relative flex min-h-screen w-full overflow-hidden bg-black/96 antialiased items-center">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 select-none bg-size-[40px_40px]",
          "bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
        )}
      />

      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 flex flex-col gap-6 text-left">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-neutral-400 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            Gestión agrícola inteligente
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
            <span className="bg-linear-to-b from-neutral-50 to-neutral-400 bg-clip-text text-transparent">
              Gestiona tu
            </span>
            <br />
            <span className="bg-linear-to-b from-neutral-50 to-neutral-400 bg-clip-text text-transparent">
              granja con
            </span>
            <br />
            <span className="bg-linear-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              FermEST
            </span>
          </h1>

          <p className="max-w-md text-base text-neutral-400 leading-relaxed">
            Tu solución integral para la administración y control de procesos agrícolas. Simple, eficiente y al alcance de tu mano.
          </p>

          <div className="flex gap-8 mt-4">
            {[
              { value: "500+", label: "Granjas activas" },
              { value: "98%", label: "Satisfacción" },
              { value: "24/7", label: "Soporte" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className="text-xs text-neutral-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />
          </div>

          <img
            src="/assets/fermentador-lab.png"
            alt="Fermentador Fermest"
            className="relative z-10 w-full max-w-sm md:max-w-lg object-contain drop-shadow-2xl"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;