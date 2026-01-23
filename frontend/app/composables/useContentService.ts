import Swal from 'sweetalert2'
import { useI18n } from 'vue-i18n'  
import { useAuthStore } from '~/store/auth'

export const useContentService = () => {
  const { t } = useI18n()

  async function create(data: object): Promise<void> {
    try {
      await $fetch('/api/content/create', {
        method: 'POST',
        body: data,
        headers: useRequestHeaders(['cookies'])
      })
      Swal.fire({
        icon: 'success',
        title: t('content.uploadedTitle'),
        text: t('content.uploadedText')
      })
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: t('content.uploadFailedTitle'),
        text: err?.statusMessage || t('content.somethingWentWrong')
      })
      if(err.statusCode == 401) useAuthStore().setUser(null);
      return Promise.reject(err)
    }
  }

  async function uploadVideo(file: File, id: string): Promise<void> {
    try {
      await $fetch(`/api/content/${id}/video`, {
        method: 'PUT',        
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'x-filename': encodeURIComponent(file.name),
          ...useRequestHeaders(['cookies'])
        }      
      })
      Swal.fire({
        icon: 'success',
        title: t('content.uploadedTitle'),
        text: t('content.uploadedText')
      })
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: t('content.uploadFailedTitle'),
        text: err?.statusMessage || t('content.somethingWentWrong')
      })
      if(err.statusCode == 401) useAuthStore().setUser(null);
      return Promise.reject(err)
    }
  }
  

  async function list(): Promise<any> {
    try {
      return await $fetch('/api/content', {
        method: 'GET',
        headers: useRequestHeaders(['cookies'])
      })
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: t('content.listFailedTitle'),
        text: err?.statusMessage || t('content.somethingWentWrong')
      })
      return Promise.reject(err)
    }
  }

  async function listMine(): Promise<any> {
    try {
      return await $fetch('/api/content/mine', {
        method: 'GET',
        headers: useRequestHeaders(['cookies'])
      })
    } catch (err: any) {
      if(err.statusCode != 401) Swal.fire({
        icon: 'error',
        title: t('content.listMineFailedTitle'),
        text: err?.statusMessage || t('content.somethingWentWrong')
      })
      if(err.statusCode == 401) useAuthStore().setUser(null);
      return Promise.reject(err)
    }
  }

  async function show(id: string): Promise<any> {
    try {
      return await $fetch(`/api/content/${id}`, {
        method: 'GET',
        headers: useRequestHeaders(['cookies'])
      })
    } catch (err: any) {
       if(err.statusCode != 401)  Swal.fire({
        icon: 'error',
        title: t('content.showFailedTitle'),
        text: err?.statusMessage || t('content.somethingWentWrong')
      })
      if(err.statusCode == 401) useAuthStore().setUser(null);
      return Promise.reject(err)
    }
  }

  async function update(id: string, data: FormData): Promise<any> {
    try {
      await $fetch(`/api/content/${id}`, {
        method: 'PATCH',
        headers: useRequestHeaders(['cookies']),
        body: data
      })
      Swal.fire({
        icon: 'success',
        title: t('content.updatedTitle'),
        text: t('content.updatedText')
      })
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: t('content.updateFailedTitle'),
        text: err?.statusMessage || t('content.somethingWentWrong')
      })
      if(err.statusCode == 401) useAuthStore().setUser(null);
      return Promise.reject(err)
    }
  }

  async function remove(id: string): Promise<void> {
    try {
      await $fetch(`/api/content/${id}`, {
        method: 'DELETE'
      })
      Swal.fire({
        icon: 'success',
        title: t('content.deletedTitle'),
        text: t('content.deletedText')
      })
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: t('content.deleteFailedTitle'),
        text: err?.statusMessage || t('content.somethingWentWrong')
      })
      if(err.statusCode == 401) useAuthStore().setUser(null);
      return Promise.reject(err)
    }
  }

  return {
    create,
    list,
    show,
    update,
    remove,
    listMine,
    uploadVideo
  }
}
