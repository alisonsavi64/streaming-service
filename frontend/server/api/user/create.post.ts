import { appendHeader, createError, defineEventHandler, H3Event, readBody } from 'h3'
import { serverApi } from '../utils/serverApi'

export default defineEventHandler(async event => {
  const api = serverApi(event)
  const { name, password, email } = await readBody(event)
  console.log(name, password, email);
  try {
    const res = await api.post('/user', {
        name,
        password,
        email
    })
    return { message: 'success' }
  } catch (err: any) {
  if (err.response) {
    throw createError({
      statusCode: err.response.status,
      statusMessage: err.response.data?.message || err.message
    })
  } else if (err.request) {
    console.log(err.request)
    throw createError({ statusCode: 503, statusMessage: 'No response from server' })
  } else {
    console.log(err.message)
    throw createError({ statusCode: 500, statusMessage: err.message })
  }
}

})