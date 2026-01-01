import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import BaseButton from '../../app/components/BaseButton.vue'
import BaseInput from '../../app/components/BaseInput.vue'
import BaseFileInput from '../../app/components/BaseFileInput.vue'
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

describe('BaseFileInput', () => {
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
})
