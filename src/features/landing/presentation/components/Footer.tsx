const footerLinks = {
  Páginas: [
    { label: "Inicio", href: "#" },
    { label: "Características", href: "#features" },
    { label: "Precios", href: "#pricing" },
    { label: "Blog", href: "#blog" },
    { label: "Equipo", href: "#team" },
  ],
  Redes: [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
  Legal: [
    { label: "Privacidad", href: "#" },
    { label: "Términos de uso", href: "#" },
    { label: "Cookies", href: "#" },
  ],
  Cuenta: [
    { label: "Registrarse", href: "/register" },
    { label: "Iniciar sesión", href: "/login" },
    { label: "Olvidé mi contraseña", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="relative w-full bg-bg overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px w-full bg-white/10" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/fermest.png"
              alt="Fermest Logo"
              className="h-8 w-8 object-contain rounded-lg"
            />
            <span className="text-white font-semibold text-lg tracking-wide">
              FermEST
            </span>
          </div>
          <p className="text-neutral-500 text-sm leading-relaxed">
            © {new Date().getFullYear()} Fermest. <br />
            Todos los derechos reservados.
          </p>
        </div>

        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category} className="flex flex-col gap-4">
            <h3 className="text-white text-sm font-semibold">{category}</h3>
            <ul className="flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-neutral-500 text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative w-full select-none overflow-hidden h-40 md:h-56">
        <div className="mx-auto max-w-7xl px-6">
          <span
            className="absolute bottom-0 whitespace-nowrap font-black text-[clamp(5rem,18vw,14rem)] leading-none text-white/4 tracking-tight"
          >
            FermEST
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;