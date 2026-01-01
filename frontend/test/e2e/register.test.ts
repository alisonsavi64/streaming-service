import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('Register API (simple)', async () => {
  await setup({ browser: false }) 
  it('can create a new user via API', async () => {
    const res = await $fetch('/api/user/create', {
      method: 'POST',
      body: {
        name: 'John Doe',
        email: `user${Date.now()}@example.com`,
        password: '123456'
      }
    })
    expect(res).toEqual({ message: 'success' })
  })
})