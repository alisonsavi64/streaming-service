import { defineEventHandler, createError, readMultipartFormData } from 'h3'
import { serverApi } from '../utils/serverApi'

export default defineEventHandler(async (event) => {
  try {
    const api = serverApi(event)
    const res: any = await api.get('/contents/mine'); 
    return res 
  } catch (err: any) {
    console.error(err)
    throw createError({ statusCode: 500, statusMessage: 'Failed to upload content.' })
  }
})
