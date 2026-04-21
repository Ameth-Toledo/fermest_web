import type { UserRequest }  from '../../models/dto/UserRequest'
import type { UserResponse } from '../../models/dto/UserResponse'
import type { User }         from '../../models/entities/User'

export interface UserRepository {
  getAll():                              Promise<User[]>
  getById(id: number):                   Promise<User>
  create(data: UserRequest):             Promise<UserResponse>
  update(id: number, data: Partial<UserRequest>): Promise<UserResponse>
  delete(id: number):                    Promise<void>
}