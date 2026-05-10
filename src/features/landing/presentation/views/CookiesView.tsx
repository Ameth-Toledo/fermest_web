import LegalLayout from "../components/LegalLayout";

const sections = [
  {
    title: "¿Qué son las cookies?",
    content:
      "Las cookies son pequeños archivos de texto que se almacenan en su navegador cuando visita nuestra plataforma. Nos ayudan a recordar sus preferencias, mantener su sesión activa y entender cómo interactúa con Nich-Ká para mejorar continuamente la experiencia.",
  },
  {
    title: "Cookies esenciales",
    content:
      "Son estrictamente necesarias para el funcionamiento de la plataforma. Incluyen las cookies de autenticación que mantienen su sesión iniciada, tokens de seguridad CSRF y preferencias de idioma. No pueden desactivarse ya que sin ellas la plataforma no funciona correctamente.",
  },
  {
    title: "Cookies de rendimiento",
    content:
      "Recopilan información anónima sobre cómo los usuarios navegan por la plataforma: páginas visitadas, tiempo de carga y posibles errores. Usamos estos datos para identificar cuellos de botella y mejorar el rendimiento general. No contienen información personal identificable.",
  },
  {
    title: "Cookies funcionales",
    content:
      "Almacenan sus preferencias de configuración, como el tema visual, parámetros predeterminados de experimentos y disposición del panel de control. Permiten que la plataforma le ofrezca una experiencia personalizada en cada visita sin necesidad de reconfigurar todo manualmente.",
  },
  {
    title: "Cookies de análisis",
    content:
      "Utilizamos herramientas de análisis para comprender patrones de uso agregados. Estas cookies nos ayudan a tomar decisiones fundamentadas sobre el desarrollo de nuevas funcionalidades. Los datos recopilados son anónimos y no se vinculan a ningún usuario individual.",
  },
  {
    title: "Duración de las cookies",
    content:
      "Las cookies de sesión se eliminan automáticamente al cerrar el navegador. Las cookies persistentes permanecen durante un periodo determinado: las de autenticación duran hasta 7 días (30 si activa 'recordarme'), y las de preferencias hasta 1 año o hasta que las elimine manualmente.",
  },
  {
    title: "Gestión y control",
    content:
      "Puede gestionar o eliminar las cookies desde la configuración de su navegador. Tenga en cuenta que deshabilitar cookies esenciales afectará el funcionamiento de la plataforma. Para las demás, puede desactivarlas sin perder el acceso, aunque algunas funciones personalizadas dejarán de estar disponibles.",
  },
  {
    title: "Actualizaciones de esta política",
    content:
      "Podemos actualizar esta política de cookies cuando incorporemos nuevas tecnologías o herramientas. Le notificaremos de cambios relevantes a través de la plataforma. La fecha de última actualización siempre se muestra en esta página.",
  },
];

const CookiesView = () => (
  <LegalLayout
    badge="Legal"
    title="Política de Cookies"
    subtitle="Explicamos de forma clara qué cookies utilizamos en Nich-Ká, para qué sirven y cómo puede gestionarlas."
    updatedAt="9 de mayo de 2026"
    sections={sections}
  />
);

export default CookiesView;
