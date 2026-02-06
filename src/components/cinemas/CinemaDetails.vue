<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useCinemaDetails } from '@/composables/useCinemaDetails'
import BaseButton from '@/components/UI/BaseButton.vue'
import BaseDivider from '@/components/UI/BaseDivider.vue'

const router = useRouter()
const { cinema, sessionsByDate, isLoading, errorMessage } = useCinemaDetails()

const openSession = (sessionId: number) => {
  void router.push({ name: 'session', params: { sessionId } })
}
</script>

<template>
  <div class="cinema-details">
    <div v-if="isLoading" class="cinema-details__state">Загрузка...</div>
    <div v-else-if="errorMessage" class="cinema-details__state">{{ errorMessage }}</div>
    <div v-else-if="!cinema" class="cinema-details__state">Кинотеатр не найден</div>
    <div v-else class="cinema-details__content">
      <div class="cinema-details__header">
        <h2 class="cinema-details__title">{{ cinema.name }}</h2>
        <div class="cinema-details__address">{{ cinema.address }}</div>
      </div>
      <div class="cinema-details__sessions">
        <h3 class="cinema-details__sessions-title">Сеансы</h3>
        <div v-if="!sessionsByDate.length" class="cinema-details__state">Нет доступных сеансов</div>
        <div v-else class="cinema-details__sessions-grid">
          <div
            v-for="dateGroup in sessionsByDate"
            :key="dateGroup.dateKey"
            class="cinema-details__date"
          >
            <div class="cinema-details__date-title">{{ dateGroup.dateLabel }}</div>
            <BaseDivider />
            <div class="cinema-details__movies">
              <div
                v-for="movie in dateGroup.movies"
                :key="movie.movieId"
                class="cinema-details__row"
              >
                <div class="cinema-details__movie-title">{{ movie.movieTitle }}</div>
                <div class="cinema-details__times">
                  <BaseButton
                    v-for="time in movie.times"
                    :key="time.id"
                    class="cinema-details__time"
                    @click="openSession(time.id)"
                  >
                    {{ time.timeLabel }}
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
