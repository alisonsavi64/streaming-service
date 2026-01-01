import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import BaseButton from '~/components/BaseButton.vue'
import BaseInput from '~/components/BaseInput.vue'
import BaseFileInput from '~/components/BaseFileInput.vue'
import ContentCard from '~/components/ContentCard.vue'
import type { ContentStatus } from '~/constants/contentStatus'

// --- Mock i18n ---
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

// --- Mock router ---
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

// --- Mock auth store ---
vi.mock('~/store/auth', () => ({
  useAuthStore: () => ({ user: { id: 'user1' } }),
}))

// --- Mock contentStatusConfig ---
vi.mock('~/constants/contentStatus', () => ({
  contentStatusConfig: {
    UPLOADED: { label: 'status.uploaded' },
    PROCESSING: { label: 'status.processing', pulse: true },
    PROCESSED: { label: 'status.processed' },
    FAILED: { label: 'status.failed' },
  },
}))

describe('Components', () => {
  it('BaseButton renders with label', () => {
    const wrapper = mount(BaseButton, { props: { label: 'click.me' } })
    expect(wrapper.text()).toContain('click.me')
  })

  it('BaseButton renders slot content', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Slot Content' } })
    expect(wrapper.text()).toContain('Slot Content')
  })

  it('BaseInput updates v-model', async () => {
    let value = ''
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: value,
        label: 'input.label',
        'onUpdate:modelValue': (v: string) => { value = v },
      },
    })
    const input = wrapper.find('input')
    await input.setValue('Hello')
    expect(value).toBe('Hello')
  })

  it('BaseFileInput emits the selected file', async () => {
    let file: any = null
    const wrapper = mount(BaseFileInput, {
      props: {
        modelValue: null,
        label: 'Upload File',
        'onUpdate:modelValue': (f: File | null) => { file = f },
      },
    })

    const input = wrapper.find('input[type="file"]')
    const testFile = new File(['hello'], 'test.txt', { type: 'text/plain' })

    Object.defineProperty(input.element, 'files', {
      value: [testFile],
      writable: false,
    })

    await input.trigger('change')

    expect(file).not.toBeNull()
    expect(file?.name).toBe('test.txt')
  })

  it('ContentCard renders video and status', () => {
    const video = {
      id: '1',
      title: 'My Video',
      description: 'Desc',
      thumbnailUrl: 'thumb.jpg',
      userId: 'user1',
      status: 'PROCESSING' as ContentStatus,
    }
    const wrapper = mount(ContentCard, { props: { video } })
    expect(wrapper.text()).toContain('My Video')
    expect(wrapper.text()).toContain('status.processing')
  })

  it('ContentCard hides status if none', () => {
    const video = {
      id: '2',
      title: 'No Status',
      description: '',
      thumbnailUrl: '',
      userId: 'user1',
    }
    const wrapper = mount(ContentCard, { props: { video } })
    expect(wrapper.find('.status-badge').exists()).toBe(false)
  })

  it('ContentCard emits edit and delete', async () => {
    const video = {
      id: '3',
      title: 'Video',
      description: '',
      thumbnailUrl: '',
      userId: 'user1',
      status: 'UPLOADED' as ContentStatus,
    }
    const wrapper = mount(ContentCard, { props: { video } })

    await wrapper.find('button.bg-blue-600').trigger('click')
    await wrapper.find('button.bg-red-600').trigger('click')

    expect(wrapper.emitted('edit')?.[0]).toEqual(['3'])
    expect(wrapper.emitted('delete')?.[0]).toEqual(['3'])
  })
})
