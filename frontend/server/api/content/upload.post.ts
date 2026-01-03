import { defineEventHandler, createError, readMultipartFormData, setCookie } from 'h3'
import { serverApi } from '../utils/serverApi'
import FormDataNode from 'form-data'

export default defineEventHandler(async (event) => {
  try {
    const api = serverApi(event)
      const res = await api.post('/contents', event.node.req, {
    headers: {
      ...event.node.req.headers,
    },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  }) 
    return res.data 
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

    throw createError({ statusCode: 503, statusMessage: 'No response from server' })
  } else {

    throw createError({ statusCode: 500, statusMessage: err.message })
  }
}
})
