import { api } from '@/boot/axios'
import type { Booking } from '../types/models'

export const fetchMyBookings = async () => {
  const { data } = await api.get<Booking[]>('/me/bookings')
  return data
}
