<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useMovieDetails } from '@/composables/useMovieDetails'
import BaseButton from '@/components/UI/BaseButton.vue'
import BaseDivider from '@/components/UI/BaseDivider.vue'

const router = useRouter()
const { movie, sessionsByDate, isLoading, errorMessage, baseUrl } = useMovieDetails()

const openSession = (sessionId: number) => {
  void router.push({ name: 'session', params: { sessionId } })
}
</script>

<template>
  <div class="movie-details">
    <div v-if="isLoading" class="movie-details__state">Загрузка...</div>
    <div v-else-if="errorMessage" class="movie-details__state">{{ errorMessage }}</div>
    <div v-else-if="!movie" class="movie-details__state">Фильм не найден</div>
    <div v-else class="movie-details__content">
      <div class="movie-details__header">
        <div class="movie-details__poster">
          <img :src="`${baseUrl}${movie.posterImage}`" :alt="movie.title" />
        </div>
        <div class="movie-details__info">
          <h2 class="movie-details__title">{{ movie.title }}</h2>
          <p class="movie-details__description">{{ movie.description }}</p>
          <div class="movie-details__meta">
            Год: {{ movie.year }} · Длительность: {{ movie.lengthMinutes }} мин · Рейтинг:
            {{ movie.rating.toFixed(1) }}
          </div>
        </div>
      </div>
      <div class="movie-details__sessions">
        <h3 class="movie-details__sessions-title">Сеансы</h3>
        <div v-if="!sessionsByDate.length" class="movie-details__state">Нет доступных сеансов</div>
        <div v-else class="movie-details__sessions-grid">
          <div
            v-for="dateGroup in sessionsByDate"
            :key="dateGroup.dateKey"
            class="movie-details__date"
          >
            <div class="movie-details__date-title">{{ dateGroup.dateLabel }}</div>
            <BaseDivider />
            <div class="movie-details__cinemas">
              <div
                v-for="cinema in dateGroup.cinemas"
                :key="cinema.cinemaId"
                class="movie-details__row"
              >
                <div class="movie-details__cinema-name">{{ cinema.cinemaName }}</div>
                <div class="movie-details__times">
                  <BaseButton
                    v-for="time in cinema.times"
                    :key="time.id"
                    class="movie-details__time"
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
