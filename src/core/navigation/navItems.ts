export const nav = [
  {
    label: 'Inicio',
    path: '/overview',
    group: null,
    allowedRoles: ['admin', 'docente', 'estudiante'],
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    description: 'Página principal'
  },
  {
    label: 'Nuevo Experimento',
    path: '/dashboard',
    group: 'Experimentar con IA',
    allowedRoles: ['admin', 'docente'],
    groupIcon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0m-9-5a4 4 0 100 8 4 4 0 000-8z',
    groupDescription: 'Configurar y analizar',
    icon: 'M12 4v16m8-8H4',
    description: 'Configurar parámetros'
  },
  {
    label: 'Resultados',
    path: '/results/:id',
    group: 'Experimentar con IA',
    allowedRoles: ['admin', 'docente'],
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'Resumen del experimento',
  },
  {
    label: 'Generaciones',
    path: '/experiment/:id',
    group: 'Experimentar con IA',
    allowedRoles: ['admin', 'docente'],
    icon: 'M3 7h18M3 12h18M3 17h18',
    description: 'Todos los individuos'
  },
  {
    label: 'Mejor por Gen.',
    path: '/experiment/:id/best-per-generation',
    group: 'Experimentar con IA',
    allowedRoles: ['admin', 'docente'],
    icon: 'M5 3l14 9-14 9V3z',
    description: 'Evolución del mejor'
  },
  {
    label: 'Gráficas',
    path: '/experiment/:id/charts',
    group: 'Experimentar con IA',
    allowedRoles: ['admin', 'docente'],
    icon: 'M3 3v18h18M7 16l4-4 4 4 4-8',
    description: 'Visualización completa'
  },
  {
    label: 'Simulación',
    path: '/simulation/:id',
    group: 'Experimentar con IA',
    allowedRoles: ['admin', 'docente'],
    icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
    description: 'Curvas de fermentación'
  },
  {
    label: 'Visualizar Gráficas',
    path: '/grafics',
    group: null,
    allowedRoles: ['admin', 'docente', 'estudiante'],
    icon: 'M3 3v18h18M7 16l4-4 4 4 4-8',
    description: 'Visualización interactiva'
  },
  {
    label: 'Calculadora de eficiencia',
    path: '/efficiency-calculator',
    group: null,
    allowedRoles: ['admin', 'docente', 'estudiante'],
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'Calcular eficiencia'
  },
  {
    label: 'Agregar Usuarios',
    path: '/users/add',
    group: 'Gestión de Usuarios',
    allowedRoles: ['admin', 'docente'],
    groupDescription: 'Administrar usuarios',
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'Registrar nuevos usuarios'
  },
  {
    label: 'Administrar Usuarios',
    path: '/users/manage',
    group: 'Gestión de Usuarios',
    allowedRoles: ['admin', 'docente'],
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'Gestionar usuarios existentes'
  },
  {
    label: 'Iniciar Fermentación',
    path: '/fermentation',
    group: null,
    allowedRoles: ['admin', 'docente'],
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'Iniciar proceso de fermentación'
  },
  {
    label: 'Reportes de Fermentación',
    path: '/fermentation-reports',
    group: null,
    allowedRoles: ['admin', 'docente', 'estudiante'],
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'Reportes de fermentación'
  },
  {
    label: 'Chat IA',
    path: '/chat',
    group: null,
    allowedRoles: ['admin', 'docente', 'estudiante'],
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    description: 'Asistente FermestBot'
  }
]