<script setup lang="ts">
import { useTickets } from '@/composables/useTickets'
import BaseButton from '@/components/UI/BaseButton.vue'
import BaseDivider from '@/components/UI/BaseDivider.vue'

const {
  unpaidTickets,
  futureTickets,
  pastTickets,
  isLoading,
  isPaying,
  errorMessage,
  pay,
  formatDateTime,
  formatDuration,
} = useTickets()
</script>

<template>
  <div class="tickets-list">
    <div v-if="isLoading" class="tickets-list__state">Загрузка...</div>
    <div v-else-if="errorMessage" class="tickets-list__state">{{ errorMessage }}</div>
    <div
      v-else-if="!unpaidTickets.length && !futureTickets.length && !pastTickets.length"
      class="tickets-list__state"
    >
      У вас пока нет билетов
    </div>
    <div v-else class="tickets-list__content">
      <h2 class="tickets-list__title">Мои билеты</h2>
      <section v-if="unpaidTickets.length" class="tickets-list__section">
        <div class="tickets-list__section-header">
          <h3 class="tickets-list__section-title">Не оплаченные</h3>
          <BaseDivider />
        </div>
        <div class="tickets-list__list">
          <div v-for="entry in unpaidTickets" :key="entry.booking.id" class="tickets-list__item">
            <div class="tickets-list__info">
              <div class="tickets-list__movie">{{ entry.movieTitle ?? 'Фильм' }}</div>
              <div class="tickets-list__cinema">{{ entry.cinemaName ?? 'Кинотеатр' }}</div>
              <div class="tickets-list__date">
                {{ entry.sessionStartTime ? formatDateTime(entry.sessionStartTime) : '—' }}
              </div>
            </div>
            <div class="tickets-list__seats">
              <div v-for="seat in entry.seatsLabel" :key="seat" class="tickets-list__seat">
                {{ seat }}
              </div>
            </div>
            <div class="tickets-list__actions">
              <BaseButton :disabled="isPaying.has(entry.booking.id)" @click="pay(entry.booking.id)">
                Оплатить
              </BaseButton>
              <div class="tickets-list__timer">
                Осталось {{ formatDuration(entry.remainingSeconds ?? 0) }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="futureTickets.length" class="tickets-list__section">
        <div class="tickets-list__section-header">
          <h3 class="tickets-list__section-title">Будущие</h3>
          <BaseDivider />
        </div>
        <div class="tickets-list__list">
          <div v-for="entry in futureTickets" :key="entry.booking.id" class="tickets-list__item">
            <div class="tickets-list__info">
              <div class="tickets-list__movie">{{ entry.movieTitle ?? 'Фильм' }}</div>
              <div class="tickets-list__cinema">{{ entry.cinemaName ?? 'Кинотеатр' }}</div>
              <div class="tickets-list__date">
                {{ entry.sessionStartTime ? formatDateTime(entry.sessionStartTime) : '—' }}
              </div>
            </div>
            <div class="tickets-list__seats">
              <div v-for="seat in entry.seatsLabel" :key="seat" class="tickets-list__seat">
                {{ seat }}
              </div>
            </div>
            <div />
          </div>
        </div>
      </section>

      <section v-if="pastTickets.length" class="tickets-list__section">
        <div class="tickets-list__section-header">
          <h3 class="tickets-list__section-title">Прошедшие</h3>
          <BaseDivider />
        </div>
        <div class="tickets-list__list">
          <div v-for="entry in pastTickets" :key="entry.booking.id" class="tickets-list__item">
            <div class="tickets-list__info">
              <div class="tickets-list__movie">{{ entry.movieTitle ?? 'Фильм' }}</div>
              <div class="tickets-list__cinema">{{ entry.cinemaName ?? 'Кинотеатр' }}</div>
              <div class="tickets-list__date">
                {{ entry.sessionStartTime ? formatDateTime(entry.sessionStartTime) : '—' }}
              </div>
            </div>
            <div class="tickets-list__seats">
              <div v-for="seat in entry.seatsLabel" :key="seat" class="tickets-list__seat">
                {{ seat }}
              </div>
            </div>
            <div />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
