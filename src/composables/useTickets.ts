import { computed, onMounted, onUnmounted, ref } from 'vue'

import {
  fetchCinemas,
  fetchMovieSessionDetails,
  fetchMovies,
  fetchMyBookings,
  fetchSettings,
  payBooking,
} from '@/api'
import type { Booking, Cinema, Movie, MovieSessionDetails } from '@/types/models'

type TicketEntry = {
  booking: Booking
  sessionStartTime?: string
  movieTitle?: string
  cinemaName?: string
  seatsLabel: string[]
  remainingSeconds?: number
}

const getSessionId = (booking: Booking) => booking.movieSessionId ?? booking.sessionId
const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })
const formatDuration = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds)
  const minutes = Math.floor(safeSeconds / 60)
  const restSeconds = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(restSeconds).padStart(2, '0')}`
}

export const useTickets = () => {
  const bookings = ref<Booking[]>([])
  const sessionDetails = ref<Map<number, MovieSessionDetails>>(new Map())
  const movieMap = ref<Map<number, Movie>>(new Map())
  const cinemaMap = ref<Map<number, Cinema>>(new Map())
  const bookingPaymentSeconds = ref<number | null>(null)
  const isLoading = ref(false)
  const isPaying = ref(new Set<string>())
  const errorMessage = ref('')
  const now = ref(Date.now())
  let timerId: number | undefined

  const loadBookings = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      const [settingsData, bookingsData, moviesData, cinemasData] = await Promise.all([
        fetchSettings(),
        fetchMyBookings(),
        fetchMovies(),
        fetchCinemas(),
      ])
      bookingPaymentSeconds.value = settingsData.bookingPaymentTimeSeconds
      bookings.value = bookingsData
      movieMap.value = new Map(moviesData.map((movie) => [movie.id, movie]))
      cinemaMap.value = new Map(cinemasData.map((cinema) => [cinema.id, cinema]))

      const sessionIds = Array.from(
        new Set(
          bookingsData
            .map((booking) => getSessionId(booking))
            .filter((id): id is number => typeof id === 'number' && Number.isFinite(id)),
        ),
      )
      const sessionResponses = await Promise.all(
        sessionIds.map((sessionId) => fetchMovieSessionDetails(sessionId)),
      )
      const sessionMap = new Map<number, MovieSessionDetails>()
      sessionResponses.forEach((session) => sessionMap.set(session.id, session))
      sessionDetails.value = sessionMap
    } catch {
      errorMessage.value = 'Не удалось загрузить билеты'
    } finally {
      isLoading.value = false
    }
  }

  const remainingSecondsFor = (booking: Booking) => {
    if (booking.isPaid || bookingPaymentSeconds.value === null) {
      return null
    }
    const bookedAt = new Date(booking.bookedAt).getTime()
    const elapsedSeconds = Math.floor((now.value - bookedAt) / 1000)
    return bookingPaymentSeconds.value - elapsedSeconds
  }

  const toEntry = (booking: Booking): TicketEntry => {
    const sessionId = getSessionId(booking)
    const session = sessionId ? sessionDetails.value.get(sessionId) : undefined
    const sessionStartTime = session?.startTime
    const movieTitle = session ? movieMap.value.get(session.movieId)?.title : undefined
    const cinemaName = session ? cinemaMap.value.get(session.cinemaId)?.name : undefined
    const seatsLabel = booking.seats.map(
      (seat) => `Ряд ${seat.rowNumber}, место ${seat.seatNumber}`,
    )
    const remainingSeconds = remainingSecondsFor(booking) ?? undefined
    return { booking, sessionStartTime, movieTitle, cinemaName, seatsLabel, remainingSeconds }
  }

  const unpaidTickets = computed(() =>
    bookings.value
      .filter((booking) => !booking.isPaid)
      .map(toEntry)
      .filter((entry) => (entry.remainingSeconds ?? 0) > 0),
  )

  const futureTickets = computed(() => {
    const currentTime = now.value
    return bookings.value
      .filter((booking) => booking.isPaid)
      .map(toEntry)
      .filter((entry) => {
        if (!entry.sessionStartTime) {
          return true
        }
        return new Date(entry.sessionStartTime).getTime() > currentTime
      })
  })

  const pastTickets = computed(() => {
    const currentTime = now.value
    return bookings.value
      .filter((booking) => booking.isPaid)
      .map(toEntry)
      .filter((entry) => {
        if (!entry.sessionStartTime) {
          return false
        }
        return new Date(entry.sessionStartTime).getTime() <= currentTime
      })
  })

  const pay = async (bookingId: string) => {
    if (isPaying.value.has(bookingId)) {
      return
    }
    isPaying.value.add(bookingId)
    errorMessage.value = ''
    try {
      await payBooking(bookingId)
      await loadBookings()
    } catch {
      errorMessage.value = 'Не удалось оплатить билет'
    } finally {
      isPaying.value.delete(bookingId)
    }
  }

  onMounted(() => {
    loadBookings()
    timerId = window.setInterval(() => {
      now.value = Date.now()
    }, 1000)
  })

  onUnmounted(() => {
    if (timerId !== undefined) {
      window.clearInterval(timerId)
    }
  })

  return {
    unpaidTickets,
    futureTickets,
    pastTickets,
    isLoading,
    isPaying,
    errorMessage,
    loadBookings,
    pay,
    formatDateTime,
    formatDuration,
  }
}
