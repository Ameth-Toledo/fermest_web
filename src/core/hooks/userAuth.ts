import { useMemo } from 'react'
import type { AuthUser } from '../../features/auth/domain/models/Auth'

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export const userAuth = () => {
  const token = localStorage.getItem('access_token')

  const user = useMemo((): AuthUser | null => {
    if (!token) return null

    // user_data se persiste completo en el login desde la respuesta del servidor.
    // El JWT solo incluye: sub, role, circuit_id — NO name ni email.
    const stored = localStorage.getItem('user_data')
    if (stored) {
      try {
        return JSON.parse(stored) as AuthUser
      } catch {
        // Si user_data está corrompido, caemos al JWT como fallback
      }
    }

    // Fallback: solo lo que viene en el payload del JWT
    const payload = parseJwt(token)
    if (!payload) return null

    return {
      id:            Number(payload.sub),
      name:          '',
      last_name:     '',
      email:         '',
      role:          payload.role      ?? 'estudiante',
      circuit_id:    payload.circuit_id ?? null,
      profile_image: null,
    }
  }, [token])

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
  }

  return { user, token, logout }
}