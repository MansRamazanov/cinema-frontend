import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { api, fetchCinemas, fetchMovieSessions, fetchMovies } from '@/api'
import type { Cinema, Movie, MovieSession } from '@/types/models'

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

type SessionTime = {
  id: number
  timeLabel: string
  startTime: string
}

type CinemaSessions = {
  cinemaId: number
  cinemaName: string
  times: SessionTime[]
}

type SessionsByDate = {
  dateKey: string
  dateLabel: string
  cinemas: CinemaSessions[]
}

export const useMovieDetails = () => {
  const route = useRoute()
  const movieId = Number(route.params.movieId)

  const movie = ref<Movie | null>(null)
  const cinemas = ref<Cinema[]>([])
  const sessions = ref<MovieSession[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const baseUrl = api.defaults.baseURL ?? ''

  const sessionsByDate = computed<SessionsByDate[]>(() => {
    const cinemaMap = new Map(cinemas.value.map((cinema) => [cinema.id, cinema]))
    const grouped = new Map<string, Map<number, CinemaSessions>>()
    const dateLabels = new Map<string, string>()

    sessions.value.forEach((session) => {
      const dateKey = session.startTime.split('T')[0] ?? session.startTime
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, new Map())
        dateLabels.set(dateKey, formatDate(session.startTime))
      }
      const cinemaSessionsMap = grouped.get(dateKey) as Map<number, CinemaSessions>
      if (!cinemaSessionsMap.has(session.cinemaId)) {
        const cinemaName = cinemaMap.get(session.cinemaId)?.name ?? 'Неизвестный кинотеатр'
        cinemaSessionsMap.set(session.cinemaId, {
          cinemaId: session.cinemaId,
          cinemaName,
          times: [],
        })
      }
      cinemaSessionsMap.get(session.cinemaId)?.times.push({
        id: session.id,
        timeLabel: formatTime(session.startTime),
        startTime: session.startTime,
      })
    })

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey, cinemaSessionsMap]) => ({
        dateKey,
        dateLabel: dateLabels.get(dateKey) ?? formatDate(dateKey),
        cinemas: Array.from(cinemaSessionsMap.values()).map((cinemaSessions) => ({
          ...cinemaSessions,
          times: cinemaSessions.times.sort((a, b) => a.startTime.localeCompare(b.startTime)),
        })),
      }))
  })

  const loadMovieDetails = async () => {
    if (!Number.isFinite(movieId) || movieId <= 0) {
      errorMessage.value = 'Некорректный идентификатор фильма'
      return
    }
    isLoading.value = true
    errorMessage.value = ''
    try {
      const [moviesData, sessionsData, cinemasData] = await Promise.all([
        fetchMovies(),
        fetchMovieSessions(movieId),
        fetchCinemas(),
      ])
      movie.value = moviesData.find((item) => item.id === movieId) ?? null
      sessions.value = sessionsData
      cinemas.value = cinemasData
      if (!movie.value) {
        errorMessage.value = 'Фильм не найден'
      }
    } catch {
      errorMessage.value = 'Не удалось загрузить данные о фильме'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(loadMovieDetails)

  return {
    movie,
    sessionsByDate,
    isLoading,
    errorMessage,
    baseUrl,
  }
}
