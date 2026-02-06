import { api } from '@/boot/axios'
import type { Movie, MovieSession } from '../types/models'

export const fetchMovies = async () => {
  const { data } = await api.get<Movie[]>('/movies')
  return data
}

export const fetchMovieSessions = async (movieId: number) => {
  const { data } = await api.get<MovieSession[]>(`/movies/${movieId}/sessions`)
  return data
}
