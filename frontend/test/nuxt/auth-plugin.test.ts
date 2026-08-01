import { describe, it, expect, vi, beforeEach } from 'vitest'

const requestFetchMock = vi.fn()

vi.mock('#app', () => ({
  defineNuxtPlugin: (plugin: any) => plugin,
  useRequestFetch: () => requestFetchMock,
}))

const authState: { user: any; setUser: (user: any) => void } = {
  user: undefined,
  setUser(user: any) {
    this.user = user
  },
}

vi.mock('~/store/auth', () => ({
  useAuthStore: () => authState,
}))

describe('auth plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authState.user = undefined
  })

  it('seeds the auth store with the authenticated user', async () => {
    requestFetchMock.mockResolvedValueOnce({ id: 'user1', name: 'Test' })
    const { default: authPlugin } = await import('~/plugins/auth')

    await authPlugin.setup()

    expect(requestFetchMock).toHaveBeenCalledWith('/api/auth/me')
    expect(authState.user).toEqual({ id: 'user1', name: 'Test' })
  })

  it('clears the auth store when the session is not valid', async () => {
    requestFetchMock.mockRejectedValueOnce(new Error('Unauthorized'))
    const { default: authPlugin } = await import('~/plugins/auth')

    await authPlugin.setup()

    expect(authState.user).toBeNull()
  })
})
