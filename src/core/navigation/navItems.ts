export const nav = [
  {
    label: 'Nuevo Experimento',
    path: '/',
    always: true,
    icon: 'M12 4v16m8-8H4',
    description: 'Configurar parámetros'
  },
  {
    label: 'Generaciones',
    path: '/experiment/:id',
    always: false,
    icon: 'M3 7h18M3 12h18M3 17h18',
    description: 'Todos los individuos'
  },
  {
    label: 'Mejor por Gen.',
    path: '/experiment/:id/best-per-generation',
    always: false,
    icon: 'M5 3l14 9-14 9V3z',
    description: 'Evolución del mejor'
  },
  {
    label: 'Gráficas',
    path: '/experiment/:id/charts',
    always: false,
    icon: 'M3 3v18h18M7 16l4-4 4 4 4-8',
    description: 'Visualización completa'
  },
  {
    label: 'Simulación',
    path: '/simulation/:id',
    always: false,
    icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
    description: 'Curvas de fermentación'
  },
]