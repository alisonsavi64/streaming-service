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
      if (item.name === 'upload') {
        console.log('Appending file:', item.name, item.filename, item.type);
        body.append(item.name, item.data, { filename: item.filename, contentType: item.type })
      } else if (item.data !== undefined) {
        body.append(item.name, item.data.toString())
      }
    }
    const headers = body.getHeaders(); 
    console.log(headers);
    const res = await api.post('/contents', body, { headers }) 
    return res.data 
  } catch (err: any) {
    console.error(err)
    throw createError({ statusCode: 500, statusMessage: 'Failed to upload content.' })
  }
})
