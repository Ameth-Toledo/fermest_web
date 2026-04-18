import { useMemo } from 'react'

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export const useAuth = () => {
  const token = localStorage.getItem('access_token')

  const user = useMemo(() => {
    if (!token) return null
    const payload = parseJwt(token)
    return {
      name: payload?.name ?? payload?.username ?? 'Usuario',
      email: payload?.email ?? '',
    }
  }, [token])

  return { user, token }
}