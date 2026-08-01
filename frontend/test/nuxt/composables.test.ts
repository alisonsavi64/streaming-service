import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'

vi.mock('#app', () => ({
  useRequestHeaders: vi.fn(() => ({ Cookie: 'test=1' })),
}))

const $fetchMock = vi.fn()
;(global as any).$fetch = $fetchMock

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn(), showLoading: vi.fn() },
}))

import { useAuthService } from '~/composables/useAuthService'
import { useContentService } from '~/composables/useContentService'
import { useUserService } from '~/composables/useUserService'

describe('Composables', () => {
  beforeEach(() => vi.clearAllMocks())

  it('login calls $fetch', async () => {
    const Dummy = defineComponent({
      setup() {
        const auth = useAuthService()
        return { auth }
      },
      render: () => h('div'),
    })
    const wrapper = mount(Dummy)

    $fetchMock.mockResolvedValueOnce({})
    await wrapper.vm.auth.login('a@b.com', 'pass')

    expect($fetchMock).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({
        body: { email: 'a@b.com', password: 'pass' },
        method: 'POST',
      })
    )
  })

  it('logout calls $fetch', async () => {
    const Dummy = defineComponent({
      setup() {
        const auth = useAuthService()
        return { auth }
      },
      render: () => h('div'),
    })
    const wrapper = mount(Dummy)

    $fetchMock.mockResolvedValueOnce({})
    await wrapper.vm.auth.logout()

    expect($fetchMock).toHaveBeenCalledWith(
      '/api/auth/logout',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('list calls $fetch', async () => {
    const Dummy = defineComponent({
      setup() {
        const content = useContentService()
        return { content }
      },
      render: () => h('div'),
    })
    const wrapper = mount(Dummy)

    $fetchMock.mockResolvedValueOnce([{ id: 1 }])
    const list = await wrapper.vm.content.list()
    expect(list).toEqual([{ id: 1 }])
  })

  it('upload calls $fetch with FormData', async () => {
    const Dummy = defineComponent({
      setup() {
        const content = useContentService()
        return { content }
      },
      render: () => h('div'),
    })
    const wrapper = mount(Dummy)
    const fd = new FormData()

    $fetchMock.mockResolvedValueOnce({})
    await wrapper.vm.content.upload(fd)

    expect($fetchMock).toHaveBeenCalledWith(
      '/api/content/upload',
      expect.objectContaining({ body: fd, method: 'POST' })
    )
  })

  it('remove calls $fetch DELETE (content)', async () => {
    const Dummy = defineComponent({
      setup() {
        const content = useContentService()
        return { content }
      },
      render: () => h('div'),
    })
    const wrapper = mount(Dummy)

    $fetchMock.mockResolvedValueOnce({})
    await wrapper.vm.content.remove('123')

    expect($fetchMock).toHaveBeenCalledWith(
      '/api/content/123',
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('create calls $fetch', async () => {
    const Dummy = defineComponent({
      setup() {
        const user = useUserService()
        return { user }
      },
      render: () => h('div'),
    })
    const wrapper = mount(Dummy)

    $fetchMock.mockResolvedValueOnce({})
    await wrapper.vm.user.create('Name', 'a@b.com', 'pass')

    expect($fetchMock).toHaveBeenCalledWith(
      '/api/user/create',
      expect.objectContaining({
        body: { name: 'Name', email: 'a@b.com', password: 'pass' },
        method: 'POST',
      })
    )
  })

  it('update calls $fetch', async () => {
    const Dummy = defineComponent({
      setup() {
        const user = useUserService()
        return { user }
      },
      render: () => h('div'),
    })
    const wrapper = mount(Dummy)

    $fetchMock.mockResolvedValueOnce({})
    await wrapper.vm.user.update('Name', 'a@b.com', 'pass')

    expect($fetchMock).toHaveBeenCalledWith(
      '/api/user/update',
      expect.objectContaining({
        body: { name: 'Name', email: 'a@b.com', password: 'pass' },
        method: 'PUT',
      })
    )
  })

  it('remove calls $fetch DELETE (user)', async () => {
    const Dummy = defineComponent({
      setup() {
        const user = useUserService()
        return { user }
      },
      render: () => h('div'),
    })
    const wrapper = mount(Dummy)

    $fetchMock.mockResolvedValueOnce({})
    await wrapper.vm.user.remove()

    expect($fetchMock).toHaveBeenCalledWith(
      '/api/user/remove',
      expect.objectContaining({ method: 'DELETE' })
    )
  })

})
