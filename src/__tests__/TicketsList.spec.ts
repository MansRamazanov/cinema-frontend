import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'

import TicketsList from '@/components/tickets/TicketsList.vue'

const payMock = vi.fn()

vi.mock('@/composables/useTickets', () => ({
  useTickets: () => ({
    unpaidTickets: ref([
      {
        booking: { id: 'booking-1' },
        sessionStartTime: '2024-07-24T12:00:00Z',
        movieTitle: 'Мстители',
        cinemaName: 'Skyline Cinema',
        seatsLabel: ['Ряд 1, место 1'],
        remainingSeconds: 60,
      },
    ]),
    futureTickets: ref([]),
    pastTickets: ref([]),
    isLoading: ref(false),
    isPaying: ref(new Set()),
    errorMessage: ref(''),
    pay: payMock,
    formatDateTime: vi.fn(() => '24.07 12:00'),
    formatDuration: vi.fn(() => '01:00'),
  }),
}))

describe('TicketsList', () => {
  beforeEach(() => {
    payMock.mockClear()
  })

  it('renders unpaid ticket and triggers payment', async () => {
    const wrapper = mount(TicketsList)
    expect(wrapper.text()).toContain('Мои билеты')
    expect(wrapper.text()).toContain('Осталось 01:00')

    await wrapper.find('button').trigger('click')
    expect(payMock).toHaveBeenCalledWith('booking-1')
  })
})
