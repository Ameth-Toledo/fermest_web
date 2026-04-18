import { NodeServer } from "./ui/NodeServer";

const Equipment = () => {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 flex flex-col gap-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex flex-col gap-6 max-w-xl">
                <span className="text-xs uppercase tracking-[0.3em] text-white/60 font-medium">
                    Nuestro fermentador
                </span> 
                <h2 className="text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter">
                    Tecnología accesible para todos.
                </h2>
                <div className="w-12 h-1 rounded-full bg-white/40" />
                <p className="max-w-md text-white/75 text-lg leading-relaxed md:pt-16">
                    Nuestro fermentador de biomasa es un sistema compacto y fácil de usar, diseñado para convertir residuos agrícolas en biogás y biofertilizantes, proporcionando una solución sostenible y eficiente para la gestión de residuos.
                </p>
            </div>  
            <div className="flex items-center justify-center">
                <NodeServer />
            </div>
        </div>
    </div>
  );
};

export default Equipment;