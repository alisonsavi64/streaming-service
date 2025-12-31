import { H3Event } from 'h3'
import { serverApi } from '../utils/serverApi'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event: H3Event): Promise<any> => {
  const api = serverApi(event)
  try {
    const user = await api.get<any>('/auth/me')
    return user
  } catch (err) {
    console.log(err)
    return createError('An error occurred while fetching the data.')
  }
})