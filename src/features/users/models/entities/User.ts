export interface User {
  id:            number
  name:          string
  last_name:     string
  email:         string
  role_id:       number
  role_name:     string
  circuit_id:    number | null
  created_by:    number | null
  created_at:    string | null
  profile_image: string | null
}