import { H3Event } from 'h3'
import Client from '../../../app/utils/api/client'
export const serverApi = (event: H3Event) => {
  const apiUrl = process.env.NUXT_API_BASE_URL || 'http://localhost:3001'
  const cookieHeader = event.node.req.headers.cookie || ''
  const client = new Client(apiUrl, {
    headers: {
      cookie: cookieHeader
    }
  })
  return client
}
