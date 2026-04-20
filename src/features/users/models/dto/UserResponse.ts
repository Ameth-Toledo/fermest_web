import type { Role } from '../entities/User'

export type UserResponse = {
  id:         number
  name:       string
  last_name:  string
  email:      string
  role_name:  Role
  circuit_id: number | null
  created_at: string
}
