import { useMemo } from 'react'

export const useAuth = () => {
  const token = localStorage.getItem('access_token')

  const user = useMemo(() => {
    if (!token) return null

    const raw = localStorage.getItem('user_data')
    if (raw) {
      try {
        const data = JSON.parse(raw)
        return {
          id:            data.id         ?? null,
          name:          data.name       ?? 'Usuario',
          last_name:     data.last_name  ?? '',
          email:         data.email      ?? '',
          role_name:     data.role       ?? null,
          circuit_id:    data.circuit_id ?? null,
          created_at:    data.created_at ?? null,
          profile_image: data.profile_image ?? null,
        }
      } catch {
        // fallback to JWT if user_data is corrupt
      }
    }

    // fallback: decode JWT
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        id:            null,
        name:          payload?.name  ?? 'Usuario',
        last_name:     '',
        email:         payload?.email ?? '',
        role_name:     payload?.role  ?? null,
        circuit_id:    payload?.circuit_id ?? null,
        created_at:    null,
        profile_image: null,
      }
    } catch {
      return null
    }
  }, [token])

  return { user, token }
}
