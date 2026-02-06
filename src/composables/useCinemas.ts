import { onMounted, ref } from 'vue'

import { fetchCinemas } from '@/api'
import type { Cinema } from '@/types/models'

export const useCinemas = () => {
  const cinemas = ref<Cinema[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  const loadCinemas = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      cinemas.value = await fetchCinemas()
    } catch {
      errorMessage.value = 'Не удалось загрузить список кинотеатров'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(loadCinemas)

  return {
    cinemas,
    isLoading,
    errorMessage,
    loadCinemas,
  }
}
