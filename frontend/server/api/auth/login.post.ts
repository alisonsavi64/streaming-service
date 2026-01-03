import { appendHeader, createError, defineEventHandler, readBody, setCookie } from 'h3'
import { serverApi } from '../utils/serverApi'

export default defineEventHandler(async event => {
  const api = serverApi(event)
  const { email, password } = await readBody(event)
  try {
    const res = await api.post('/auth/login', {
      password,
      email
    })
    const setCookie = res.headers['set-cookie']
    if (setCookie) {
      const cookies = Array.isArray(setCookie) ? setCookie : [setCookie]
      for (const cookie of cookies) {
        appendHeader(event, 'set-cookie', cookie)
      }
    }

    return { message: 'success' }
  } catch (err: any) {
  if (err.response) {
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
