import { onMounted, ref } from 'vue'

import { api, fetchMovies } from '@/api'
import type { Movie } from '@/types/models'

export const useMovies = () => {
  const movies = ref<Movie[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const baseUrl = api.defaults.baseURL ?? ''

  const loadMovies = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      movies.value = await fetchMovies()
    } catch {
      errorMessage.value = 'Не удалось загрузить список фильмов'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(loadMovies)

  return {
    movies,
    isLoading,
    errorMessage,
    baseUrl,
    loadMovies,
  }
}
