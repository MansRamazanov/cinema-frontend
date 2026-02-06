<script setup lang="ts">
import { useSessionDetails } from '@/composables/useSessionDetails'
import BaseButton from '@/components/UI/BaseButton.vue'

const {
  movie,
  cinema,
  session,
  seatNumbers,
  rows,
  sessionDateTime,
  isLoading,
  isSubmitting,
  errorMessage,
  isAuthenticated,
  toggleSeat,
  submitBooking,
} = useSessionDetails()
</script>

<template>
  <div class="session-booking">
    <div v-if="isLoading" class="session-booking__state">Загрузка...</div>
    <div v-else-if="errorMessage" class="session-booking__state">{{ errorMessage }}</div>
    <div v-else-if="!session" class="session-booking__state">Сеанс не найден</div>
    <div v-else class="session-booking__content">
      <div class="session-booking__header">
        <h2 class="session-booking__title">Выбрать места</h2>
        <div class="session-booking__meta">
          <div>Фильм: {{ movie?.title ?? '—' }}</div>
          <div>Кинотеатр: {{ cinema?.name ?? '—' }}</div>
          <div>Время: {{ sessionDateTime }}</div>
        </div>
      </div>

      <div class="session-booking__seats">
        <div
          class="session-booking__numbers"
          :style="{ gridTemplateColumns: `60px repeat(${seatNumbers.length}, 34px)` }"
        >
          <span class="session-booking__numbers-label" />
          <span v-for="seatNumber in seatNumbers" :key="seatNumber" class="session-booking__number">
            {{ seatNumber }}
          </span>
        </div>
        <div
          v-for="row in rows"
          :key="row.rowNumber"
          class="session-booking__row"
          :style="{ gridTemplateColumns: `60px repeat(${seatNumbers.length}, 34px)` }"
        >
          <div class="session-booking__row-label">ряд {{ row.rowNumber }}</div>
          <button
            v-for="seat in row.seats"
            :key="`${seat.rowNumber}-${seat.seatNumber}`"
            class="session-booking__seat"
            :class="{
              'session-booking__seat--booked': seat.isBooked,
              'session-booking__seat--selected': seat.isSelected,
            }"
            type="button"
            :disabled="seat.isBooked || isSubmitting"
            @click="toggleSeat(seat)"
          />
        </div>
      </div>

      <BaseButton class="session-booking__submit" :disabled="isSubmitting" @click="submitBooking">
        {{ isAuthenticated ? 'Забронировать' : 'Войти для бронирования' }}
      </BaseButton>
    </div>
  </div>
</template>
