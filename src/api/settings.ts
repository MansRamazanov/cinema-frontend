import { api } from '@/boot/axios'
import type { Settings } from '../types/models'

export const fetchSettings = async () => {
  const { data } = await api.get<Settings>('/settings')
  return data
}
