import axios from 'axios'

export default defineNuxtPlugin(() => {

const api = axios.create({
baseURL: 'http://100.109.45.123:3001', 
})

api.interceptors.request.use(config => {
const token = localStorage.getItem('token')
if (token) config.headers.Authorization = `Bearer ${token}`
return config
})


return { provide: { api } }
})