export type UserRequest = {
  name:       string
  last_name:  string
  email:      string
  password:   string
  role_id:    number
  circuit_id: number | null
}
