export const getEfficiencyColor = (pct: number): string => {
  if (pct >= 80) return '#22C55E'
  if (pct >= 50) return '#F59E0B'
  return '#F43F5E'
}

export const getEfficiencyLabel = (pct: number): { text: string; color: string } => {
  if (pct === 0)  return { text: 'Ingresa los valores para calcular',   color: '#52525B' }
  if (pct >= 90)  return { text: 'Excelente — fermentación óptima',     color: '#22C55E' }
  if (pct >= 75)  return { text: 'Buena eficiencia',                    color: '#4ADE80' }
  if (pct >= 50)  return { text: 'Eficiencia aceptable — revisar proceso', color: '#F59E0B' }
  return           { text: 'Baja eficiencia — proceso deficiente',      color: '#F43F5E' }
}
