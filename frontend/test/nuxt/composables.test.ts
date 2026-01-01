import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick, defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'

vi.mock('#app', () => {
    return {
        useRequestHeaders: vi.fn(() => ({ Cookie: 'test=1' })),
    }
})

const $fetchMock = vi.fn()
    ; (global as any).$fetch = $fetchMock

import { useAuthService } from '~/composables/useAuthService'
import { useContentService } from '~/composables/useContentService'
import { useUserService } from '~/composables/useUserService'
import { useTheme } from '~/composables/useTheme'

describe('Composables', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('login calls $fetch', async () => {
        const auth = useAuthService()
        $fetchMock.mockResolvedValueOnce({})
        await auth.login('a@b.com', 'pass')
        expect($fetchMock).toHaveBeenCalledWith(
            '/api/auth/login',
            expect.objectContaining({
                body: { email: 'a@b.com', password: 'pass' },
                method: 'POST',
            })
        )
    })

    it('logout calls $fetch', async () => {
        const auth = useAuthService()
        $fetchMock.mockResolvedValueOnce({})
        await auth.logout()
        expect($fetchMock).toHaveBeenCalledWith(
            '/api/auth/logout',
            expect.objectContaining({ method: 'POST' })
        )
    })

    it('list calls $fetch', async () => {
        const content = useContentService()
        $fetchMock.mockResolvedValueOnce([{ id: 1 }])
        const list = await content.list()
        expect($fetchMock).toHaveBeenCalledWith(
            '/api/content',
            expect.objectContaining({ method: 'GET' })
        )
        expect(list).toEqual([{ id: 1 }])
    })

    it('upload calls $fetch with FormData', async () => {
        const content = useContentService()
        const fd = new FormData()
        $fetchMock.mockResolvedValueOnce({})
        await content.upload(fd)
        expect($fetchMock).toHaveBeenCalledWith(
            '/api/content/upload',
            expect.objectContaining({
                method: 'POST',
                body: fd
            })
        )
    })

    it('remove calls $fetch DELETE', async () => {
        const content = useContentService()
        $fetchMock.mockResolvedValueOnce({})
        await content.remove('123')
        expect($fetchMock).toHaveBeenCalledWith(
            '/api/content/123',
            expect.objectContaining({ method: 'DELETE' })
        )
    })

    it('create calls $fetch', async () => {
        const user = useUserService()
        $fetchMock.mockResolvedValueOnce({})
        await user.create('Name', 'a@b.com', 'pass')
        expect($fetchMock).toHaveBeenCalledWith(
            '/api/user/create',
            expect.objectContaining({
                method: 'POST',
                body: { name: 'Name', email: 'a@b.com', password: 'pass' },
            })
        )
    })

    it('update calls $fetch', async () => {
        const user = useUserService()
        $fetchMock.mockResolvedValueOnce({})
        await user.update('Name', 'a@b.com', 'pass')
        expect($fetchMock).toHaveBeenCalledWith(
            '/api/user/update',
            expect.objectContaining({
                method: 'PUT',
                body: { name: 'Name', email: 'a@b.com', password: 'pass' },
            })
        )
    })

    it('remove calls $fetch', async () => {
        const user = useUserService()
        $fetchMock.mockResolvedValueOnce({})
        await user.remove()
        expect($fetchMock).toHaveBeenCalledWith(
            '/api/user/remove',
            expect.objectContaining({ method: 'DELETE' })
        )
    })

    describe('useTheme', () => {
        let originalLocalStorage: Storage
        let toggleSpy: any

        beforeEach(() => {
            originalLocalStorage = global.localStorage
            global.localStorage = {
                getItem: vi.fn((key) => (key === 'theme' ? 'dark' : null)),
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
                length: 0,
                key: vi.fn(),
            } as unknown as Storage

            toggleSpy = vi.spyOn(document.documentElement.classList, 'toggle')
        })

        afterEach(() => {
            global.localStorage = originalLocalStorage
            toggleSpy.mockRestore()
        })

        it('should initialize dark mode correctly', async () => {
            const Dummy = defineComponent({
                setup() {
                    useTheme()
                    return () => h('div')
                },
            })
            mount(Dummy)
            await nextTick()
            expect(toggleSpy).toHaveBeenCalledWith('dark', true)
        })

        it('toggles dark mode', async () => {
            (global.localStorage.getItem as any).mockReturnValueOnce(null)

            const theme = useTheme()
            theme.toggleTheme()
            expect(theme.isDark.value).toBe(false)
            expect(global.localStorage.setItem).toHaveBeenCalledWith('theme', 'light')
            expect(toggleSpy).toHaveBeenCalledWith('dark', false)
        })
    })
})
