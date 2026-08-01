import { describe, it, expect, vi, beforeEach } from 'vitest'

const navigateToMock = vi.fn((to: any) => ({ __navigateTo: to }))

vi.mock('#app', () => ({
  navigateTo: navigateToMock,
}))

const authState: { user: any } = { user: null }

vi.mock('~/store/auth', () => ({
  useAuthStore: () => authState,
}))

describe('only_auth middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authState.user = null
  })

  it('redirects to login when there is no authenticated user', async () => {
    const { default: onlyAuth } = await import('~/middleware/only_auth')

    onlyAuth({ path: '/contents/upload' } as any, {} as any)

    expect(navigateToMock).toHaveBeenCalledWith('/auth/login')
  })

  it('does not redirect when the auth store already has a user', async () => {
    authState.user = { id: 'user1' }
    const { default: onlyAuth } = await import('~/middleware/only_auth')

    const result = onlyAuth({ path: '/contents/upload' } as any, {} as any)

    expect(navigateToMock).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('does not redirect while already on the login page', async () => {
    const { default: onlyAuth } = await import('~/middleware/only_auth')

    onlyAuth({ path: '/auth/login' } as any, {} as any)

    expect(navigateToMock).not.toHaveBeenCalled()
  })
})

describe('no_auth middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authState.user = null
  })

  it('redirects home when the auth store already has a user', async () => {
    authState.user = { id: 'user1' }
    const { default: noAuth } = await import('~/middleware/no_auth')

    noAuth({} as any, {} as any)

    expect(navigateToMock).toHaveBeenCalledWith('/', { replace: true })
  })

  it('does not redirect when there is no authenticated user', async () => {
    const { default: noAuth } = await import('~/middleware/no_auth')

    const result = noAuth({} as any, {} as any)

    expect(navigateToMock).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })
})
