import { userApi }             from '../api/userApi'
import type { UserRepository } from '../../domain/repositories/UserRepository'
import type { UserRequest }    from '../../models/dto/UserRequest'
import type { UserResponse }   from '../../models/dto/UserResponse'
import type { User }           from '../../models/entities/User'

export class UserRepositoryImpl implements UserRepository {
  async getAll(): Promise<User[]> {
    const res = await userApi.getAll()
    if (!res.ok) throw new Error('Error al obtener usuarios')
    return res.json()
  }

  async getById(id: number): Promise<User> {
    const res = await userApi.getById(id)
    if (!res.ok) throw new Error('Error al obtener usuario')
    return res.json()
  }

  async create(data: UserRequest): Promise<UserResponse> {
    const res = await userApi.create(data)
    if (!res.ok) throw new Error('Error al crear usuario')
    return res.json()
  }

  async update(id: number, data: Partial<UserRequest>): Promise<UserResponse> {
    const res = await userApi.update(id, data)
    if (!res.ok) throw new Error('Error al actualizar usuario')
    return res.json()
  }

  async delete(id: number): Promise<void> {
    const res = await userApi.delete(id)
    if (!res.ok) throw new Error('Error al eliminar usuario')
  }
}