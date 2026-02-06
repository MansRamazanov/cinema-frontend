export type Movie = {
  id: number
  title: string
  description: string
  year: number
  lengthMinutes: number
  posterImage: string
  rating: number
}

export type Cinema = {
  id: number
  name: string
  address: string
}

export type MovieSession = {
  id: number
  movieId: number
  cinemaId: number
  startTime: string
}

export type Seat = {
  rowNumber: number
  seatNumber: number
}

export type MovieSessionWithSeats = MovieSession & {
  seats: {
    rows: number
    seatsPerRow: number
  }
}

export type MovieSessionDetails = MovieSessionWithSeats & {
  bookedSeats: Seat[]
}

export type Booking = {
  id: string
  userId: number
  movieSessionId: number
  sessionId?: number
  bookedAt: string
  seats: Seat[]
  isPaid: boolean
}

export type Settings = {
  bookingPaymentTimeSeconds: number
}

export type AuthResponse = {
  token: string
}

export type BookingResponse = {
  bookingId: string
}

export type PaymentResponse = {
  message: string
}

export type Credentials = {
  username: string
  password: string
}
