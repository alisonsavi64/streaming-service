import Swal from 'sweetalert2'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/store/auth'

export const useAuthService = () => {
  const { t } = useI18n()

  async function login(email: string, password: string): Promise<void> {
    try {
      await $fetch('/api/auth/login', {
        body: { email, password },
        method: 'POST',
      })
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: t('auth.loginFailed'),     
        text: err?.statusMessage || t('auth.somethingWentWrong'),
      })
      return Promise.reject(err)
    }
  }

  async function logout(): Promise<void> {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (err: any) {
      return Promise.reject(err)
    }
  }

  async function me(): Promise<any> {
    try {
      const user = await $fetch('/api/auth/me', {
        headers: useRequestHeaders(['cookies']),
      })
      return user
    } catch (err: any) {
      if(err.statusCode == 401) useAuthStore().setUser(null);
      return Promise.reject(err)
    }
  }

  return {
    login,
    me,
    logout,
  }
}
