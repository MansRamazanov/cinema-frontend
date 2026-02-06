import { createRouter, createWebHistory } from 'vue-router'

import MoviesPage from '@/pages/movies/MoviesPage.vue'
import MoviePage from '@/pages/movies/MoviePage.vue'
import CinemasPage from '@/pages/cinemas/CinemasPage/CinemasPage.vue'
import CinemaPage from '@/pages/cinemas/CinemaPage/CinemaPage.vue'
import SessionPage from '@/pages/sessions/SessionPage.vue'
import TicketsPage from '@/pages/tickets/TicketsPage.vue'
import LoginPage from '@/pages/login/LoginPage.vue'
import RegisterPage from '@/pages/register/RegisterPage.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/movies',
    },
    {
      path: '/movies',
      name: 'movies',
      component: MoviesPage,
      meta: { title: 'Фильмы', breadcrumb: 'Фильмы / Главная' },
    },
    {
      path: '/movies/:movieId',
      name: 'movie',
      component: MoviePage,
      meta: { title: 'Фильм', breadcrumb: 'Фильмы / Детали' },
    },
    {
      path: '/cinemas',
      name: 'cinemas',
      component: CinemasPage,
      meta: { title: 'Кинотеатры', breadcrumb: 'Кинотеатры / Главная' },
    },
    {
      path: '/cinemas/:cinemaId',
      name: 'cinema',
      component: CinemaPage,
      meta: { title: 'Кинотеатр', breadcrumb: 'Кинотеатры / Детали' },
    },
    {
      path: '/sessions/:sessionId',
      name: 'session',
      component: SessionPage,
      meta: { title: 'Сеанс', breadcrumb: 'Сеанс / Выбор места' },
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: TicketsPage,
      meta: { title: 'Мои билеты', breadcrumb: 'Мои билеты / Главная', requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { title: 'Вход', breadcrumb: 'Вход / Главная', guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: { title: 'Регистрация', breadcrumb: 'Регистрация / Главная', guestOnly: true },
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'tickets' }
  }
  return true
})

export default router
