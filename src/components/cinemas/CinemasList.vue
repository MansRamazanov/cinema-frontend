<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useCinemas } from '@/composables/useCinemas'
import BaseButton from '@/components/UI/BaseButton.vue'

const router = useRouter()
const { cinemas, isLoading, errorMessage } = useCinemas()

const openCinema = (cinemaId: number) => {
  void router.push({ name: 'cinema', params: { cinemaId } })
}
</script>

<template>
  <div class="cinema-list">
    <div v-if="isLoading" class="cinema-list__state">Загрузка...</div>
    <div v-else-if="errorMessage" class="cinema-list__state">{{ errorMessage }}</div>
    <div v-else class="cinema-list__grid">
      <div v-for="cinema in cinemas" :key="cinema.id" class="cinema-list__item">
        <div>
          <div class="cinema-list__name">{{ cinema.name }}</div>
          <div class="cinema-list__address">{{ cinema.address }}</div>
        </div>
        <BaseButton class="cinema-list__button" @click="openCinema(cinema.id)">
          Посмотреть сеансы
        </BaseButton>
      </div>
    </div>
  </div>
</template>
