import { appendHeader, createError, defineEventHandler, H3Event, readBody, setCookie } from 'h3'
import { serverApi } from '../utils/serverApi'

export default defineEventHandler(async event => {
  const api = serverApi(event)
  const { name, password, email } = await readBody(event)
  try {
    const res = await api.put('/user', {
        name,
        password,
        email
    })
    setCookie(event, 'access_token', '', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 0, 
    })
    return { message: 'success' }
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