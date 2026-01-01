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
  } catch (err) {
    throw createError('An error occurred while fetching the data.')
  }

})