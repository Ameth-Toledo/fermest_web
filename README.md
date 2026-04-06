# FermEST — Frontend

Interfaz web para el sistema de optimización de procesos de fermentación mediante algoritmos genéticos. Construida con React, TypeScript y Tailwind CSS.

---

## Stack

- **React 19** + **TypeScript**
- **Vite** como bundler
- **Tailwind CSS v4** para estilos
- **React Router v7** para navegación
- **Recharts** para visualización de datos
- **Zustand** para estado global persistente

## Arquitectura

Clean Architecture con patrón MVVM organizada por features:

```
src/
├── core/
│   ├── navigation/     # Router y nav items
│   └── store/          # Estado global (Zustand)
├── shared/
│   └── layout/         # Layout y Sidebar
└── features/
    └── dashboard/
        ├── domain/
        │   ├── models/         # Interfaces y tipos
        │   └── repositories/   # Contratos
        ├── data/
        │   └── repositories/   # Implementaciones con fetch
        └── presentation/
            ├── view/           # Vistas/páginas
            ├── viewmodels/     # Lógica (custom hooks)
            └── components/     # Componentes reutilizables
```

## Vistas

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | Dashboard | Formulario con sliders para configurar el experimento |
| `/results/:id` | Results | Resumen del mejor individuo y evolución del fitness |
| `/experiment/:id` | Experiment | Todas las generaciones con sus individuos |
| `/experiment/:id/best-per-generation` | BestPerGeneration | Evolución del mejor individuo por generación |
| `/experiment/:id/charts` | Charts | 4 gráficas de análisis completo |
| `/simulation/:id` | Simulation | Curvas de fermentación de un individuo |

## Instalación

```bash
npm install
```

Crea un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:8000
```

## Desarrollo

```bash
npm run dev
```

## Producción

```bash
npm run build
```