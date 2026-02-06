import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'

import MovieDetails from '@/components/movies/MovieDetails.vue'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('@/composables/useMovieDetails', () => ({
  useMovieDetails: () => ({
    movie: ref({
      id: 3,
      title: 'Темный рыцарь',
      description: 'Описание фильма',
      year: 2008,
      lengthMinutes: 152,
      rating: 9.0,
      posterImage: '/poster.jpg',
    }),
    sessionsByDate: ref([
      {
        dateKey: '2024-07-24',
        dateLabel: '24.07',
        cinemas: [
          {
            cinemaId: 1,
            cinemaName: 'Skyline Cinema',
            times: [{ id: 10, timeLabel: '15:30' }],
          },
        ],
      },
    ]),
    isLoading: ref(false),
    errorMessage: ref(''),
    baseUrl: 'https://img.local',
  }),
}))

describe('MovieDetails', () => {
  beforeEach(() => {
    pushMock.mockClear()
  })

  it('renders sessions and navigates to session', async () => {
    const wrapper = mount(MovieDetails)
    expect(wrapper.text()).toContain('Темный рыцарь')
    expect(wrapper.text()).toContain('15:30')

    await wrapper.find('button').trigger('click')
    expect(pushMock).toHaveBeenCalledWith({ name: 'session', params: { sessionId: 10 } })
  })
})
