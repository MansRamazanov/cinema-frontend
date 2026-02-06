import { defineStore } from 'pinia'

import { login, register, logout as apiLogout } from '@/api/auth'
import { tokenStorage } from '@/api/tokenStorage'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: tokenStorage.getAccessToken(),
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken),
  },
  actions: {
    async login(username: string, password: string) {
      const response = await login({ username, password })
      this.accessToken = response.token
      return response
    },
    async register(username: string, password: string) {
      const response = await register({ username, password })
      this.accessToken = response.token
      return response
    },
    logout() {
      apiLogout()
      this.accessToken = null
    },
  },
})
