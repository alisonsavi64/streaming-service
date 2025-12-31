import Client from '../utils/api/client'

export const useApi = () => {
  const { apiUrl } = useRuntimeConfig().public

  const client = new Client(apiUrl as string, {
    withCredentials: true 
  })

  return client
}
