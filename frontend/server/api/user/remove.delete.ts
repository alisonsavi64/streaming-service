import { appendHeader, createError, defineEventHandler, H3Event, readBody } from 'h3'
import { serverApi } from '../utils/serverApi'

export default defineEventHandler(async event => {
  const api = serverApi(event)
  try {
    const res = await api.delete('/user')
    return { message: 'success' }
  } catch (err) {
    throw createError('An error occurred while fetching the data.')
  }

})