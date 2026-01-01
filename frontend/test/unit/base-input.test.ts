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

describe('BaseInput', () => {
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
})
