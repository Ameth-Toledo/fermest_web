import { useState, useCallback } from 'react'
import { ProfileRepositoryImpl } from '../../data/repositories/ProfileRepositoryImpl'
import { notifyUserUpdated, useUserAuth } from '../../../../core/hooks/userAuth'

const repository = new ProfileRepositoryImpl()

export type InfoForm = { name: string; last_name: string; email: string }
export type PasswordForm = { current: string; next: string; confirm: string }

export const useProfileViewModel = () => {
  const { user } = useUserAuth()

  // ── Info personal ──────────────────────────────────────────────────────────
  const [infoForm, setInfoForm] = useState<InfoForm>({
    name: user?.name ?? '',
    last_name: user?.last_name ?? '',
    email: user?.email ?? '',
  })
  const [editingInfo, setEditingInfo] = useState(false)
  const [loadingInfo, setLoadingInfo] = useState(false)
  const [successInfo, setSuccessInfo] = useState(false)
  const [errorInfo, setErrorInfo] = useState<string | null>(null)

  // ── Contraseña ─────────────────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState<PasswordForm>({ current: '', next: '', confirm: '' })
  const [loadingPw, setLoadingPw] = useState(false)
  const [successPw, setSuccessPw] = useState(false)
  const [errorPw, setErrorPw] = useState<string | null>(null)

  // ── Avatar ─────────────────────────────────────────────────────────────────
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
    localStorage.getItem('profile_image') ?? null
  )
  const [pickingAvatar, setPickingAvatar] = useState(false)

  // ── Activación de circuito ─────────────────────────────────────────────────
  // Si el usuario ya tiene circuito, no necesita el formulario de activación
  const [circuitId, setCircuitId] = useState<number | null>(user?.circuit_id ?? null)
  const [activationCode, setActivationCode] = useState('')
  const [loadingActivation, setLoadingActivation] = useState(false)
  const [successActivation, setSuccessActivation] = useState(false)
  const [errorActivation, setErrorActivation] = useState<string | null>(null)

  // ── Computed ───────────────────────────────────────────────────────────────
  const pwMismatch = pwForm.confirm !== '' && pwForm.next !== pwForm.confirm
  const pwValid = !!(pwForm.current && pwForm.next && pwForm.next === pwForm.confirm && pwForm.next.length >= 6)
  const infoChanged = infoForm.name !== (user?.name ?? '') || infoForm.last_name !== (user?.last_name ?? '') || infoForm.email !== (user?.email ?? '')
  const hasCircuit = circuitId !== null   // ← controla si se muestra el formulario

  // ── Handlers ───────────────────────────────────────────────────────────────
  const setInfo = (key: keyof InfoForm, val: string) => setInfoForm(prev => ({ ...prev, [key]: val }))
  const setPw = (key: keyof PasswordForm, val: string) => setPwForm(prev => ({ ...prev, [key]: val }))

  const handleSaveInfo = useCallback(async () => {
    if (!infoChanged || !user) return
    setLoadingInfo(true); setErrorInfo(null)
    try {
      await repository.updateUser(user.id, {
        name: infoForm.name,
        last_name: infoForm.last_name,
        email: infoForm.email,
      })
      // Actualizar user_data en localStorage
      const stored = localStorage.getItem('user_data')
      if (stored) {
        localStorage.setItem('user_data', JSON.stringify({
          ...JSON.parse(stored),
          name: infoForm.name,
          last_name: infoForm.last_name,
          email: infoForm.email,
        }))
      }
      notifyUserUpdated()
      setSuccessInfo(true); setEditingInfo(false)
      setTimeout(() => setSuccessInfo(false), 3000)
    } catch (err) {
      setErrorInfo(err instanceof Error ? err.message : 'Error al actualizar la información.')
    } finally {
      setLoadingInfo(false)
    }
  }, [infoChanged, infoForm, user])

  const handleCancelInfo = useCallback(() => {
    setEditingInfo(false)
    setInfoForm({ name: user?.name ?? '', last_name: user?.last_name ?? '', email: user?.email ?? '' })
    setErrorInfo(null)
  }, [user])

  const handleSavePw = useCallback(async () => {
    if (!pwValid || !user) return
    setLoadingPw(true); setErrorPw(null)
    try {
      // TODO: conectar endpoint de cambio de contraseña cuando esté disponible
      await repository.updateUser(user.id, { password: pwForm.next })
      setSuccessPw(true); setPwForm({ current: '', next: '', confirm: '' })
      setTimeout(() => setSuccessPw(false), 3000)
    } catch (err) {
      setErrorPw(err instanceof Error ? err.message : 'Error al cambiar la contraseña.')
    } finally {
      setLoadingPw(false)
    }
  }, [pwValid, pwForm, user])

  const handleSelectAvatar = useCallback((path: string) => {
    setSelectedAvatar(path)
    localStorage.setItem('profile_image', path)
    setPickingAvatar(false)
    // TODO: PUT /users/{id} con { profile_image: path }
  }, [])

  const handleActivateCircuit = useCallback(async () => {
    const code = activationCode.trim().toUpperCase()
    if (code.length !== 8) { setErrorActivation('El código debe tener 8 caracteres.'); return }
    setLoadingActivation(true); setErrorActivation(null); setSuccessActivation(false)
    try {
      const result = await repository.activateCircuit({ activation_code: code })

      // 1. Guardar el nuevo token (ya incluye circuit_id en el payload)
      localStorage.setItem('access_token', result.access_token)

      // 2. Actualizar user_data con el nuevo circuit_id
      const stored = localStorage.getItem('user_data')
      if (stored) {
        localStorage.setItem('user_data', JSON.stringify({
          ...JSON.parse(stored),
          circuit_id: result.circuit_id,
        }))
      }

      // 3. Notificar a TODOS los hooks montados (incluyendo useFermentationViewModel)
      notifyUserUpdated()

      // 4. Actualizar estado local del perfil
      setCircuitId(result.circuit_id)
      setSuccessActivation(true)
      setActivationCode('')
      setTimeout(() => setSuccessActivation(false), 4000)
    } catch (err) {
      setErrorActivation(err instanceof Error ? err.message : 'Error al activar el circuito.')
    } finally {
      setLoadingActivation(false)
    }
  }, [activationCode])
  
  return {
    // datos del usuario
    user,
    infoForm,
    pwForm,
    selectedAvatar,
    pickingAvatar,
    circuitId,
    activationCode,
    hasCircuit,
    // estados de UI
    editingInfo,
    loadingInfo,
    loadingPw,
    loadingActivation,
    successInfo,
    successPw,
    successActivation,
    errorInfo,
    errorPw,
    errorActivation,
    // computed
    pwMismatch,
    pwValid,
    infoChanged,
    // setters simples
    setInfo,
    setPw,
    setEditingInfo,
    setPickingAvatar,
    setActivationCode,
    // handlers
    handleSaveInfo,
    handleCancelInfo,
    handleSavePw,
    handleSelectAvatar,
    handleActivateCircuit,
  }
}