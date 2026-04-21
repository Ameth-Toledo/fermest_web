import { useState }           from 'react'
import { UserRepositoryImpl } from '../../data/repositories/UserRepositoryImpl'
import type { AddUserForm }   from '../types/AddUserForm'

const repo = new UserRepositoryImpl()

const initialForm: AddUserForm = {
  name:            '',
  last_name:       '',
  email:           '',
  password:        '',
  confirm:         '',
  role:            'estudiante',
  activation_code: '',
}

export const useAddUserViewModel = () => {
  const [form,    setForm]    = useState<AddUserForm>(initialForm)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)

  const set = (key: keyof AddUserForm, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const mismatch = form.confirm !== '' && form.password !== form.confirm
  const isValid  = !!(
    form.name && form.last_name && form.email &&
    form.password && !mismatch &&
    form.role && form.activation_code
  )

  const handleSubmit = async () => {
    if (!isValid) return
    setLoading(true)
    setError(null)
    try {
      await repo.create({
        name:            form.name,
        last_name:       form.last_name,
        email:           form.email,
        password:        form.password,
        role:            form.role,
        activation_code: form.activation_code,
      })
      setSuccess(true)
      setForm(initialForm)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear el usuario.')
    } finally {
      setLoading(false)
    }
  }

  return {
    form, set, mismatch, isValid,
    loading, success, error,
    showPassword, setShowPassword,
    showConfirm,  setShowConfirm,
    handleSubmit,
  }
}