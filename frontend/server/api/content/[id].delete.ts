import { defineEventHandler, createError, readMultipartFormData } from 'h3'
import { serverApi } from '../utils/serverApi'

export default defineEventHandler(async (event) => {
  try {
    const api = serverApi(event);
    const id = event.context.params?.id;
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Content ID is required.' });
    }
    const res: any = await api.delete(`/contents/${id}`); 
    return res 
  } catch (err: any) {
    console.error(err)
    throw createError({ statusCode: 500, statusMessage: 'Failed to get content.' })
  }
})

