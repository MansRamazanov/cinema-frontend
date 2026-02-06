<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useMovies } from '@/composables/useMovies'
import BaseButton from '@/components/UI/BaseButton.vue'

const router = useRouter()
const { movies, isLoading, errorMessage, baseUrl } = useMovies()

const openMovie = (movieId: number) => {
  void router.push({ name: 'movie', params: { movieId } })
}
</script>

<template>
  <div class="movies-list">
    <div v-if="isLoading" class="movies-list__state">Загрузка...</div>
    <div v-else-if="errorMessage" class="movies-list__state">{{ errorMessage }}</div>
    <div v-else class="movies-list__grid">
      <div class="movies-list__header">
        <span />
        <span>Название</span>
        <span>Продолжительность</span>
        <span>Рейтинг</span>
        <span />
      </div>
      <div v-for="movie in movies" :key="movie.id" class="movies-list__row">
        <div class="movies-list__poster">
          <img :src="`${baseUrl}${movie.posterImage}`" :alt="movie.title" />
        </div>
        <div>{{ movie.title }}</div>
        <div class="movies-list__duration">
          <span class="for-mobile">Длительность:</span>
          {{ Math.floor(movie.lengthMinutes / 60) }}:{{
            String(movie.lengthMinutes % 60).padStart(2, '0')
          }}
        </div>
        <div class="movies-list__rating">
          <span class="for-mobile">Рейтинг:</span>
          {{ movie.rating.toFixed(1) }}
        </div>
        <BaseButton class="movies-list__button" @click="openMovie(movie.id)">
          Посмотреть сеансы
        </BaseButton>
      </div>
    </div>
  </div>
</template>
