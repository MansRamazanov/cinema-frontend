import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { createBooking, fetchCinemas, fetchMovieSessionDetails, fetchMovies } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { formatDate, formatTime } from '@/utils/date'
import type { Cinema, Movie, MovieSessionDetails, Seat } from '@/types/models'

type SeatView = {
  rowNumber: number
  seatNumber: number
  isBooked: boolean
  isSelected: boolean
}

type SeatRow = {
  rowNumber: number
  seats: SeatView[]
}

export const useSessionDetails = () => {
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const sessionId = Number(route.params.sessionId)

  const session = ref<MovieSessionDetails | null>(null)
  const movie = ref<Movie | null>(null)
  const cinema = ref<Cinema | null>(null)
  const selectedSeats = ref<Seat[]>([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const errorMessage = ref('')

  const bookedSeatsSet = computed(() => {
    const set = new Set<string>()
    session.value?.bookedSeats.forEach((seat) => {
      set.add(`${seat.rowNumber}:${seat.seatNumber}`)
    })
    return set
  })

  const seatNumbers = computed(() => {
    const seatsPerRow = session.value?.seats.seatsPerRow ?? 0
    return Array.from({ length: seatsPerRow }, (_, index) => index + 1)
  })

  const rows = computed<SeatRow[]>(() => {
    const rowsCount = session.value?.seats.rows ?? 0
    const seatsPerRow = session.value?.seats.seatsPerRow ?? 0
    return Array.from({ length: rowsCount }, (_, rowIndex) => {
      const rowNumber = rowIndex + 1
      const seats = Array.from({ length: seatsPerRow }, (_, seatIndex) => {
        const seatNumber = seatIndex + 1
        const key = `${rowNumber}:${seatNumber}`
        const isBooked = bookedSeatsSet.value.has(key)
        const isSelected = selectedSeats.value.some(
          (seat) => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber,
        )
        return {
          rowNumber,
          seatNumber,
          isBooked,
          isSelected,
        }
      })
      return { rowNumber, seats }
    })
  })

  const sessionDateTime = computed(() => {
    if (!session.value) {
      return ''
    }
    return `${formatDate(session.value.startTime)}, ${formatTime(session.value.startTime)}`
  })

  const toggleSeat = (seat: SeatView) => {
    if (!authStore.isAuthenticated || seat.isBooked || isSubmitting.value) {
      return
    }
    const index = selectedSeats.value.findIndex(
      (item) => item.rowNumber === seat.rowNumber && item.seatNumber === seat.seatNumber,
    )
    if (index >= 0) {
      selectedSeats.value.splice(index, 1)
    } else {
      selectedSeats.value.push({ rowNumber: seat.rowNumber, seatNumber: seat.seatNumber })
    }
  }

  const loadSessionDetails = async () => {
    if (!Number.isFinite(sessionId) || sessionId <= 0) {
      errorMessage.value = 'Некорректный идентификатор сеанса'
      return
    }
    isLoading.value = true
    errorMessage.value = ''
    try {
      const [sessionData, moviesData, cinemasData] = await Promise.all([
        fetchMovieSessionDetails(sessionId),
        fetchMovies(),
        fetchCinemas(),
      ])
      session.value = sessionData
      movie.value = moviesData.find((item) => item.id === sessionData.movieId) ?? null
      cinema.value = cinemasData.find((item) => item.id === sessionData.cinemaId) ?? null
    } catch {
      errorMessage.value = 'Не удалось загрузить данные о сеансе'
    } finally {
      isLoading.value = false
    }
  }

  const submitBooking = async () => {
    if (!authStore.isAuthenticated) {
      await router.push({ name: 'login' })
      return
    }
    if (!session.value) {
      return
    }
    if (!selectedSeats.value.length) {
      errorMessage.value = 'Выберите хотя бы одно место'
      return
    }
    isSubmitting.value = true
    errorMessage.value = ''
    try {
      await createBooking(session.value.id, selectedSeats.value)
      await router.push({ name: 'tickets' })
    } catch {
      errorMessage.value = 'Не удалось забронировать места'
    } finally {
      isSubmitting.value = false
    }
  }

  onMounted(loadSessionDetails)

  return {
    movie,
    cinema,
    session,
    seatNumbers,
    rows,
    sessionDateTime,
    isLoading,
    isSubmitting,
    errorMessage,
    isAuthenticated: computed(() => authStore.isAuthenticated),
    toggleSeat,
    submitBooking,
  }
}
