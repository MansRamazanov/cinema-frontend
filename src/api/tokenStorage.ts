const ACCESS_TOKEN_KEY = 'cinema_access_token'

const storage = typeof window !== 'undefined' ? window.localStorage : undefined

export const tokenStorage = {
  getAccessToken(): string | null {
    return storage?.getItem(ACCESS_TOKEN_KEY) ?? null
  },
  setAccessToken(token: string) {
    storage?.setItem(ACCESS_TOKEN_KEY, token)
  },
  clearAccessToken() {
    storage?.removeItem(ACCESS_TOKEN_KEY)
  },
}
