const WS_URL = (import.meta.env.VITE_WS_URL ?? import.meta.env.VITE_API_URL?.replace(/^http/, 'ws'))

export type DeviceState = {
  motor:               'encendido' | 'apagado'
  bomba:               'encendido' | 'apagado'
  sensor_temperatura:  'encendido' | 'apagado'
  sensor_ph:           'encendido' | 'apagado'
  sensor_alcohol:      'encendido' | 'apagado'
  sensor_conductividad:'encendido' | 'apagado'
  sensor_turbidez:     'encendido' | 'apagado'
}

export const DEFAULT_STATE: DeviceState = {
  motor:                'apagado',
  bomba:                'apagado',
  sensor_temperatura:   'apagado',
  sensor_ph:            'apagado',
  sensor_alcohol:       'apagado',
  sensor_conductividad: 'apagado',
  sensor_turbidez:      'apagado',
}

// Mapeo SensorKey del front → clave del WS de comandos
export const SENSOR_KEY_TO_COMMAND: Record<string, keyof DeviceState> = {
  temperature:  'sensor_temperatura',
  ph:           'sensor_ph',
  alcohol:      'sensor_alcohol',
  conductivity: 'sensor_conductividad',
  turbidity:    'sensor_turbidez',
  rpm:          'motor',
  pump:         'bomba',
}

export const createCommandsWebSocket = (circuitId: number): WebSocket =>
  new WebSocket(`${WS_URL}/ws/circuit/${circuitId}/commands`)