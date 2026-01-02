import { defineEventHandler, createError, readMultipartFormData } from 'h3'
import { serverApi } from '../utils/serverApi'
import FormDataNode from 'form-data'

export default defineEventHandler(async (event) => {
  try {
    const api = serverApi(event)
    const formItems = await readMultipartFormData(event) || []
    const body = new FormDataNode()
    for (const item of formItems) {
      console.log(item)
      if (!item.name) continue
      if (item.name === 'upload' || item.name === 'thumbnail') {
        console.log('Appending file:', item.name, item.filename, item.type);
        body.append(item.name, item.data, { filename: item.filename, contentType: item.type })
      } else if (item.data !== undefined) {
        body.append(item.name, item.data.toString())
      }
    }
    const headers = body.getHeaders(); 
    const res = await api.post('/contents', body, { headers }) 
    return res.data 
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
