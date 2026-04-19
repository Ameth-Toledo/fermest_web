// circuit_id ya NO viene del formulario — se toma del usuario autenticado
export interface FermentationFormData {
  scheduled_start: string
  scheduled_end:   string
  initial_sugar:   number
}