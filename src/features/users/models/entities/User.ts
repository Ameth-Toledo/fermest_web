export type Role = 'Administrador' | 'Operador'

export type User = {
  id:         number
  name:       string
  last_name:  string
  email:      string
  role_name:  Role
  circuit_id: number | null
  created_at: string
}
