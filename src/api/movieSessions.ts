import { api } from '@/boot/axios'
import type { BookingResponse, MovieSessionDetails, Seat } from '../types/models'

export const fetchMovieSessionDetails = async (movieSessionId: number) => {
  const { data } = await api.get<MovieSessionDetails>(`/movieSessions/${movieSessionId}`)
  return data
}

export const createBooking = async (movieSessionId: number, seats: Seat[]) => {
  const { data } = await api.post<BookingResponse>(`/movieSessions/${movieSessionId}/bookings`, {
    seats,
  })
  return data
}
