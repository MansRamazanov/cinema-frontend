import { api } from '@/boot/axios'
import type { PaymentResponse } from '../types/models'

export const payBooking = async (bookingId: string) => {
  const { data } = await api.post<PaymentResponse>(`/bookings/${bookingId}/payments`)
  return data
}
