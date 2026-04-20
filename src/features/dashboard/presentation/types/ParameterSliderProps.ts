export type ParameterSliderProps = {
  name: string
  label: string
  min: number
  max: number
  step: number
  unit: string
  description: string
  icon: string
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onStep: (name: string, step: number, min: number, max: number, direction: number) => void
  onStopStep: () => void
}
