export { api } from '@/boot/axios'
export { tokenStorage } from './tokenStorage'

export { login, logout, register } from './auth'
export { fetchCinemas, fetchCinemaSessions } from './cinemas'
export { fetchMovies, fetchMovieSessions } from './movies'
export { fetchMovieSessionDetails, createBooking } from './movieSessions'
export { payBooking } from './bookings'
export { fetchMyBookings } from './users'
export { fetchSettings } from './settings'

export type { ApiError } from '../types/api'
export type {
  AuthResponse,
  Booking,
  BookingResponse,
  Cinema,
  Credentials,
  Movie,
  MovieSession,
  MovieSessionDetails,
  MovieSessionWithSeats,
  PaymentResponse,
  Seat,
  Settings,
} from '../types/models'
