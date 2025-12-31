

export const useAuthService = () => {
    async function create(email: string, password: string) : Promise<void> {
        try {
            await $fetch('/api/content', {
                body: {
                    email,
                    password
                },
                method: 'POST'
            })

        } catch(err) {
            return Promise.reject(err)
        }
    }

    async function logout() : Promise<void> {
        try {
            await $fetch('/api/auth/logout', {
                method: 'POST'
            })

        } catch(err) {
            return Promise.reject(err)
        }
    }

    async function me() : Promise<any> {
        try {
            const user = await $fetch('/api/auth/me', {
                headers: useRequestHeaders(['cookies'])
            });
            return user
        } catch(err) {
            return Promise.reject(err)
        }
    }

    return {
        login,
        me,
        logout
    }

}