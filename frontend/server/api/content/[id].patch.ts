import { defineEventHandler, createError, readBody } from 'h3'
import { serverApi } from '../utils/serverApi'

export default defineEventHandler(async (event) => {
  try {
    const api = serverApi(event)
    const id = event.context.params?.id
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Content ID is required.' })
    }
    const body = await readBody(event) as { title?: string; description?: string }
    if (!body.title && !body.description) {
      throw createError({ statusCode: 400, statusMessage: 'Nothing to update.' })
    }
    console.log(body, id)
    const updated = await api.patch(`/contents/${id}`, body)
    return updated
  } catch (err: any) {
    console.error(err)
    throw createError({ statusCode: 500, statusMessage: 'Failed to update content.' })
  }
})
