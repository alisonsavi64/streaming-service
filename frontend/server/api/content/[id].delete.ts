import { defineEventHandler, createError, readMultipartFormData, setCookie } from 'h3'
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
  if (err.response) {
    if (err.response.status === 401) {
      setCookie(event, 'access_token', '', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 0,
      })
    }
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

