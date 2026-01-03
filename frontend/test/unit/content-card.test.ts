import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ContentCard from '../../app/components/ContentCard.vue'
import type { ContentStatus } from '../../app/constants/contentStatus'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('~/store/auth', () => ({
  useAuthStore: () => ({ user: { id: 'user1' } }),
}))

vi.mock('~/constants/contentStatus', () => ({
  contentStatusConfig: {
    UPLOADED: { label: 'status.uploaded' },
    PROCESSING: { label: 'status.processing', pulse: true },
    PROCESSED: { label: 'status.processed' },
    FAILED: { label: 'status.failed' },
  },
}))

describe('ContentCard', () => {
  it('renders video title and status', () => {
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

  it('does not render status badge when status is missing', () => {
    const video = {
      id: '2',
      title: 'No Status',
      description: '',
      thumbnailUrl: '',
      userId: 'user1',
    }

    const wrapper = mount(ContentCard, { props: { video } })

    expect(wrapper.text()).not.toContain('status.')
  })

  it('emits edit and delete events when owner clicks buttons', async () => {
    const video = {
      id: '3',
      title: 'Video',
      description: '',
      thumbnailUrl: '',
      userId: 'user1',
      status: 'UPLOADED' as ContentStatus,
    }

    const wrapper = mount(ContentCard, { props: { video } })

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)

    await buttons[0].trigger('click')
    await buttons[1].trigger('click')

    expect(wrapper.emitted('edit')?.[0]).toEqual(['3'])
    expect(wrapper.emitted('delete')?.[0]).toEqual(['3'])
  })
})
