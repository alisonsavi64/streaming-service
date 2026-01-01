 
 
 export const useUserService = () => {
 
    async function create(name: string, email: string, password: string) : Promise<void> {
            try {
                await $fetch('/api/user/create', {
                    body: {
                        name,
                        email,
                        password
                    },
                    method: 'POST'
                })

            } catch(err) {
                return Promise.reject(err)
            }
        }
        async function update(name: string, email: string, password: string) : Promise<void> {
            try {
                await $fetch('/api/user/update', {
                    body: {
                        name,
                        email,
                        password
                    },
                    method: 'PUT' as any
                })

            } catch(err) {
                return Promise.reject(err)
            }
        }

    async function remove() : Promise<void> {
        try {
            await $fetch('/api/user/remove', {
                method: 'DELETE'
            })
        } catch(err) {
            return Promise.reject(err)
        }
    }
 
     return {
        create,
        update,
        remove
     }
 
 }
 
 
