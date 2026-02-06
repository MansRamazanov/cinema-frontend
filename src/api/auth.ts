import { api } from '@/boot/axios'
import { tokenStorage } from './tokenStorage'
import type { AuthResponse, Credentials } from '../types/models'

export const login = async (credentials: Credentials) => {
  const { data } = await api.post<AuthResponse>('/login', credentials)
  tokenStorage.setAccessToken(data.token)
  return data
}

export const register = async (credentials: Credentials) => {
  const { data } = await api.post<AuthResponse>('/register', credentials)
  tokenStorage.setAccessToken(data.token)
  return data
}

export const logout = () => {
  tokenStorage.clearAccessToken()
}
