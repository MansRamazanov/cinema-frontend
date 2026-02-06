<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const breadcrumb = computed(() => {
  const metaBreadcrumb = route.meta.breadcrumb
  if (typeof metaBreadcrumb === 'string' && metaBreadcrumb.length > 0) {
    return metaBreadcrumb
  }
  return 'Фильмы / Главная'
})

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'movies' })
}
</script>

<template>
  <div class="app">
    <aside class="sidebar">
      <div class="sidebar__title">Меню</div>
      <nav class="menu">
        <RouterLink to="/movies" class="menu__item" active-class="menu__item--active">
          Фильмы
        </RouterLink>
        <RouterLink to="/cinemas" class="menu__item" active-class="menu__item--active">
          Кинотеатры
        </RouterLink>
        <RouterLink to="/tickets" class="menu__item" active-class="menu__item--active">
          Мои билеты
        </RouterLink>
        <RouterLink
          v-if="!authStore.isAuthenticated"
          to="/login"
          class="menu__item"
          active-class="menu__item--active"
        >
          Вход
        </RouterLink>
        <button v-else type="button" class="menu__item menu__item--button" @click="handleLogout">
          Выход
        </button>
      </nav>
    </aside>

    <main class="content">
      <header class="content__header">{{ breadcrumb }}</header>
      <section class="content__body">
        <RouterView />
      </section>
    </main>
  </div>
</template>
