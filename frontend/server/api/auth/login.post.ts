import { appendHeader, createError, defineEventHandler, readBody } from 'h3'
import { serverApi } from '../utils/serverApi'

export default defineEventHandler(async event => {
  const api = serverApi(event)
  const { email, password } = await readBody(event)
  console.log(password, email);
  try {
    const res = await api.post('/auth/login', {
      password,
      email
    })
    const setCookie = res.headers['set-cookie']
    console.log(setCookie);
    if (setCookie) {
      const cookies = Array.isArray(setCookie) ? setCookie : [setCookie]
      for (const cookie of cookies) {
        appendHeader(event, 'set-cookie', cookie)
      }
    }

    return { message: 'success' }
  } catch (err) {
    console.log(err);
    throw createError({ statusCode: 500, statusMessage: 'An error occurred while fetching the data.' })
  }
})
