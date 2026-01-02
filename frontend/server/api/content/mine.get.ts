import { defineEventHandler, createError, readMultipartFormData } from 'h3'
import { serverApi } from '../utils/serverApi'

export default defineEventHandler(async (event) => {
  try {
    const api = serverApi(event)
    const res: any = await api.get('/contents/mine'); 
    return res 
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
