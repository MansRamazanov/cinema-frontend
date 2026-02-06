import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { fetchCinemaSessions, fetchCinemas, fetchMovies } from '@/api'
import { formatDate, formatTime } from '@/utils/date'
import type { Cinema, Movie, MovieSession } from '@/types/models'

type SessionTime = {
  id: number
  timeLabel: string
  startTime: string
}

type MovieSessions = {
  movieId: number
  movieTitle: string
  times: SessionTime[]
}

type SessionsByDate = {
  dateKey: string
  dateLabel: string
  movies: MovieSessions[]
}

export const useCinemaDetails = () => {
  const route = useRoute()
  const cinemaId = Number(route.params.cinemaId)

  const cinema = ref<Cinema | null>(null)
  const movies = ref<Movie[]>([])
  const sessions = ref<MovieSession[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  const sessionsByDate = computed<SessionsByDate[]>(() => {
    const movieMap = new Map(movies.value.map((movie) => [movie.id, movie]))
    const grouped = new Map<string, Map<number, MovieSessions>>()
    const dateLabels = new Map<string, string>()

    sessions.value.forEach((session) => {
      const dateKey = session.startTime.split('T')[0] ?? session.startTime
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, new Map())
        dateLabels.set(dateKey, formatDate(session.startTime))
      }
      const moviesMap = grouped.get(dateKey) as Map<number, MovieSessions>
      if (!moviesMap.has(session.movieId)) {
        const movieTitle = movieMap.get(session.movieId)?.title ?? 'Неизвестный фильм'
        moviesMap.set(session.movieId, { movieId: session.movieId, movieTitle, times: [] })
      }
      moviesMap.get(session.movieId)?.times.push({
        id: session.id,
        timeLabel: formatTime(session.startTime),
        startTime: session.startTime,
      })
    })

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey, moviesMap]) => ({
        dateKey,
        dateLabel: dateLabels.get(dateKey) ?? formatDate(dateKey),
        movies: Array.from(moviesMap.values()).map((movieSessions) => ({
          ...movieSessions,
          times: movieSessions.times.sort((a, b) => a.startTime.localeCompare(b.startTime)),
        })),
      }))
  })

  const loadCinemaDetails = async () => {
    if (!Number.isFinite(cinemaId) || cinemaId <= 0) {
      errorMessage.value = 'Некорректный идентификатор кинотеатра'
      return
    }
    isLoading.value = true
    errorMessage.value = ''
    try {
      const [cinemasData, sessionsData, moviesData] = await Promise.all([
        fetchCinemas(),
        fetchCinemaSessions(cinemaId),
        fetchMovies(),
      ])
      cinema.value = cinemasData.find((item) => item.id === cinemaId) ?? null
      sessions.value = sessionsData
      movies.value = moviesData
      if (!cinema.value) {
        errorMessage.value = 'Кинотеатр не найден'
      }
    } catch {
      errorMessage.value = 'Не удалось загрузить данные о кинотеатре'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(loadCinemaDetails)

  return {
    cinema,
    sessionsByDate,
    isLoading,
    errorMessage,
  }
}
