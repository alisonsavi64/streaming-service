

export const useContentService = () => {
    async function upload(formData: FormData): Promise<void> {
        try {
        await $fetch('/api/content/upload', {
            method: 'POST',
            body: formData,
            headers: useRequestHeaders(['cookies'])
        })
        } catch (err) {
        return Promise.reject(err)
    }
  }

  async function list(): Promise<any> {
        try {
        return await $fetch('/api/content/list', {
            method: 'GET',
            headers: useRequestHeaders(['cookies'])
        })
        } catch (err) {
        return Promise.reject(err)
    }
  }

   async function show(id: string): Promise<any> {
        try {
        return await $fetch(`/api/content/${id}`, {
            method: 'GET',
            headers: useRequestHeaders(['cookies'])
        })
        } catch (err) {
        return Promise.reject(err)
    }
  }

  async function update(id: string, data: any): Promise<any> {
        try {
        return await $fetch(`/api/content/${id}`, {
            method: 'PATCH',
            headers: useRequestHeaders(['cookies']),
            body: JSON.stringify(data)
        })
        } catch (err) {
        return Promise.reject(err)
    }
  }

  async function remove(id: string): Promise<void> {
        try {
            await $fetch(`/api/content/${id}`, {
                method: 'DELETE'
            })
        } catch(err) {
            return Promise.reject(err)
        }
    }
    return {
        upload,
        list,
        show,
        update,
        remove
    }

}
