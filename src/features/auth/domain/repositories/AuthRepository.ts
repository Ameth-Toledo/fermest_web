import type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  TokenResponse,
  AccessTokenResponse,
  RegisterResponse,
} from '../models/Auth'

export interface AuthRepository {
  login(data: LoginRequest): Promise<TokenResponse>
  register(data: RegisterRequest): Promise<RegisterResponse>
  refreshToken(data: RefreshTokenRequest): Promise<AccessTokenResponse>
}