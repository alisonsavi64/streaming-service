import { defineEventHandler, createError } from 'h3'
import { serverApi } from '../../utils/serverApi'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Content ID is required.' })
  }

  try {
    const api = serverApi(event)
    await api.post(`/contents/${id}/view`)
    return { message: 'View recorded' }
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
