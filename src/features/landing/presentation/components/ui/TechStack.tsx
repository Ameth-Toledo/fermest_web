import { TechComponent } from "./TechComponent";

const TechStack = () => (
  <section className="relative w-full overflow-hidden bg-bg">
    <div
      className="pointer-events-none absolute inset-0 select-none bg-size-[40px_40px]"
      style={{ backgroundImage: "linear-gradient(to right,#111 1px,transparent 1px),linear-gradient(to bottom,#111 1px,transparent 1px)" }}
    />

    <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 flex flex-col items-center gap-12">
      <TechComponent />
    </div>
  </section>
);

export default TechStack;
