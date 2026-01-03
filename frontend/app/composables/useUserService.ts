import Swal from 'sweetalert2'
import { useI18n } from 'vue-i18n' 
import { useAuthStore } from '~/store/auth'

export const useUserService = () => {
  const { t } = useI18n()

  async function create(name: string, email: string, password: string): Promise<void> {
    try {
      await $fetch('/api/user/create', {
        body: { name, email, password },
        method: 'POST'
      })

      Swal.fire({
        icon: 'success',
        title: t('user.createdTitle'),
        text: t('user.createdText')
      })
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: t('user.creationFailedTitle'),
        text:  err?.statusMessage === "User already exists"
                ? t('user.userAlreadyExists')
                : t('auth.somethingWentWrong')
      })
      return Promise.reject(err)
    }
  }

  async function update(name: string, email: string, password: string): Promise<void> {
    try {
      await $fetch('/api/user/update', {
        body: { name, email, password },
        method: 'PUT' as any
      })

      Swal.fire({
        icon: 'success',
        title: t('user.updatedTitle'),
        text: t('user.updatedText')
      })
      useAuthStore().setUser(null); 
      navigateTo("/auth/login");
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: t('user.updateFailedTitle'),
                text:  err?.statusMessage === "A user with this email already exists"
                ? t('user.userEmailInUse')
                : t('auth.somethingWentWrong')
      })
      if(err.statusCode == 401) useAuthStore().setUser(null); 
      return Promise.reject(err)
    }
  }

  async function remove(): Promise<void> {
    try {
      await $fetch('/api/user/remove', {
        method: 'DELETE'
      })

      Swal.fire({
        icon: 'success',
        title: t('user.removedTitle'),
        text: t('user.removedText')
      })
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: t('user.removalFailedTitle'),
        text: err?.statusMessage || t('user.removalFailedText')
      })
      if(err.statusCode == 401) useAuthStore().setUser(null);
      return Promise.reject(err)
    }
  }

  return {
    create,
    update,
    remove
  }
}
