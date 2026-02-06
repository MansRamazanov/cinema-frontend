import axios, { AxiosError } from 'axios'
import type { App } from 'vue'

import { tokenStorage } from '@/api/tokenStorage'
import type { ApiError } from '@/types/api'

const DEFAULT_TIMEOUT_MS = 10000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3022'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const normalizeApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<Record<string, unknown>>
    const status = axiosError.response?.status
    const responseData = axiosError.response?.data
    const message =
      (typeof responseData?.message === 'string' && responseData.message) ||
      axiosError.message ||
      'Ошибка сети'
    const code = (typeof responseData?.code === 'string' && responseData.code) || axiosError.code

    return {
      status,
      code,
      message,
      details: responseData,
    }
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: 'Ошибка сети' }
}

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error)),
)

export const setupAxios = (app: App) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
}
