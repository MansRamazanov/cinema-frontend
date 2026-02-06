import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'

import MoviesList from '@/components/movies/MoviesList.vue'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('@/composables/useMovies', () => ({
  useMovies: () => ({
    movies: ref([
      {
        id: 1,
        title: 'Тестовый фильм',
        lengthMinutes: 125,
        rating: 8.4,
        posterImage: '/poster.jpg',
      },
    ]),
    isLoading: ref(false),
    errorMessage: ref(''),
    baseUrl: 'https://img.local',
  }),
}))

describe('MoviesList', () => {
  beforeEach(() => {
    pushMock.mockClear()
  })

  it('renders movie data and navigates on click', async () => {
    const wrapper = mount(MoviesList)
    expect(wrapper.text()).toContain('Тестовый фильм')
    expect(wrapper.text()).toContain('2:05')
    expect(wrapper.text()).toContain('8.4')

    await wrapper.find('button').trigger('click')
    expect(pushMock).toHaveBeenCalledWith({ name: 'movie', params: { movieId: 1 } })
  })
})
