import { appendHeader, createError, defineEventHandler, H3Event, setCookie } from 'h3'
import { serverApi } from '../utils/serverApi'

export default defineEventHandler(async event => {
  const api = serverApi(event)
  try {
    setCookie(event, 'access_token', '', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 0, 
    })
    await api.post('/auth/logout')
    return { message: 'success' }
  } catch (err) {
    throw createError('An error occurred while fetching the data.')
  }

})