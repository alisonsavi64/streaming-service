import { H3Event, setCookie } from 'h3'
import { serverApi } from '../utils/serverApi'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event: H3Event): Promise<any> => {
  const api = serverApi(event)
  try {
    const user = await api.get<any>('/auth/me')
    return user
  } catch (err: any) {
  if (err.response) {
    if (err.response.status === 401) {
      setCookie(event, 'access_token', '', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 0,
      })
    }
    throw createError({
      statusCode: err.response.status,
      statusMessage: err.response.data?.message || err.message
    })
  } else if (err.request) {

    throw createError({ statusCode: 503, statusMessage: 'No response from server' })
  } else {

    throw createError({ statusCode: 500, statusMessage: err.message })
  }
}
})