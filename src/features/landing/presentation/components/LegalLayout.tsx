import { useState, type ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import Header from "./Header";
import Footer from "./Footer";
import ContactChat from "./ContactChat";
import { cn } from "../../../../lib/utils";

interface LegalSection {
  title: string;
  content: string | ReactNode;
}

interface LegalLayoutProps {
  badge: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  sections: LegalSection[];
}

const LegalLayout = ({ badge, title, subtitle, updatedAt, sections }: LegalLayoutProps) => {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <>
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
    <div className="min-h-screen bg-bg text-white">
      <Header />

      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 select-none",
            "bg-[size:40px_40px]",
            "bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)]"
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-radial-[ellipse_80%_40%_at_50%_0%] from-green-500/6 to-transparent" />

        <div className="relative z-10 mx-auto max-w-3xl text-center flex flex-col gap-4">
          <span className="inline-block self-center text-xs uppercase tracking-[0.3em] text-green-500/80 font-medium">
            {badge}
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-xl mx-auto">{subtitle}</p>
          <p className="text-neutral-600 text-xs mt-2">Última actualización: {updatedAt}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px w-full bg-white/10" />
      </div>

      <main className="mx-auto max-w-3xl px-6 py-16 flex flex-col gap-12">
        {sections.map((section, i) => (
          <article key={i} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-green-500 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="text-lg font-semibold text-white">{section.title}</h2>
            </div>
            <div className="pl-10 text-sm text-neutral-400 leading-relaxed border-l border-white/5">
              {typeof section.content === "string" ? (
                <p>{section.content}</p>
              ) : (
                section.content
              )}
            </div>
          </article>
        ))}
      </main>

      <div className="mx-auto max-w-7xl px-6 pb-6">
        <div className="rounded-2xl border border-white/10 bg-white/3 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">¿Tienes alguna pregunta?</p>
            <p className="text-xs text-neutral-500 mt-0.5">Puedes contactarnos en cualquier momento.</p>
          </div>
          <button
            onClick={() => setChatOpen(true)}
            className="shrink-0 text-sm font-medium px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors duration-200"
          >
            Contáctanos
          </button>
        </div>
      </div>

      <Footer />
    </div>
    </ReactLenis>

    <ContactChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};

export default LegalLayout;
