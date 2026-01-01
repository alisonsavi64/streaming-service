import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('User & Auth API', async () => {
  await setup({ browser: false })
  const randomEmail = `user${Date.now()}@example.com`
  const password = '123456'
  const name = 'John Doe'
  it('can create a new user', async () => {
    const res = await $fetch('/api/user/create', {
      method: 'POST',
      body: { name, email: randomEmail, password }
    })
    expect(res).toEqual({ message: 'success' })
  })
  
  it('can login with the user', async () => {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: randomEmail, password }
    })
    expect(res).toEqual({ message: 'success' })
  })

  it('can update an existing user', async () => {
    const res = await $fetch('/api/user/update', {
      method: 'PUT',
      body: { name: 'John Updated', email: randomEmail, password }
    })
    expect(res).toEqual({ message: 'success' })
  })

  it('can logout', async () => {
    const res = await $fetch('/api/auth/logout', { method: 'POST' })
    expect(res).toEqual({ message: 'success' })
  })
})
