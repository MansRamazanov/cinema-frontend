import { api } from '@/boot/axios'
import type { Cinema, MovieSession } from '../types/models'

export const fetchCinemas = async () => {
  const { data } = await api.get<Cinema[]>('/cinemas')
  return data
}

export const fetchCinemaSessions = async (cinemaId: number) => {
  const { data } = await api.get<MovieSession[]>(`/cinemas/${cinemaId}/sessions`)
  return data
}
