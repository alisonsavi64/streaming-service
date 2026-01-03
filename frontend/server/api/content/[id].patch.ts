import { defineEventHandler, createError, readMultipartFormData, setCookie } from 'h3'
import { serverApi } from '../utils/serverApi'
import FormDataNode from 'form-data'

export default defineEventHandler(async (event) => {
  try {
    const api = serverApi(event)
    const formItems = await readMultipartFormData(event) || []
    const body = new FormDataNode()
    const id = event.context.params?.id
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Content ID is required.' })
    }
    for (const item of formItems) {
      if (!item.name) continue
      if (item.name === 'thumbnail') {
        body.append(item.name, item.data, { filename: item.filename, contentType: item.type })
      } else if (item.data !== undefined) {
        body.append(item.name, item.data.toString())
      }
    }
    const headers = body.getHeaders(); 
    await api.patch(`/contents/${id}`, body, { headers }) 
    return  {message: 'success' }
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
