import { describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => ({ meta: {} }),
  useRouter: () => ({ push: pushMock }),
  RouterLink: { template: '<a><slot /></a>' },
  RouterView: { template: '<div />' },
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    isAuthenticated: false,
    logout: vi.fn(),
  }),
}))

describe('App', () => {
  it('renders main navigation items', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Фильмы')
    expect(wrapper.text()).toContain('Кинотеатры')
    expect(wrapper.text()).toContain('Мои билеты')
  })
})
