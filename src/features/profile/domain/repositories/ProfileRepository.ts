import type {
  UpdateUserRequest,
  ActivateCircuitRequest,
  ActivateCircuitResponse,
  UserProfile,
} from '../models/Profile'

export interface ProfileRepository {
  updateUser(userId: number, data: UpdateUserRequest): Promise<UserProfile>
  activateCircuit(data: ActivateCircuitRequest): Promise<ActivateCircuitResponse>
}