import { authApi } from '../api/authApi'
import type { AuthRepository } from '../../domain/repositories/AuthRepository'
import type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  TokenResponse,
  AccessTokenResponse,
  RegisterResponse,
} from '../../domain/models/Auth'

export class AuthRepositoryImpl implements AuthRepository {
  async login(data: LoginRequest): Promise<TokenResponse> {
    return authApi.login(data)
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return authApi.register(data)
  }

  async refreshToken(data: RefreshTokenRequest): Promise<AccessTokenResponse> {
    return authApi.refreshToken(data)
  }
}