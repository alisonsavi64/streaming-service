import axios from 'axios'
import FormDataNode from 'form-data'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export default class Client {
  private axiosInstance: AxiosInstance

  constructor(baseUrl: string, config?: AxiosRequestConfig) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      ...config,
    })
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> { 
    const headers =
      data instanceof FormDataNode
        ? { ...(config?.headers || {}), ...data.getHeaders() }
        : config?.headers

    const response = await this.axiosInstance.post(url, data, { ...config, headers })
    return response
  }



  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const headers =
      data instanceof FormDataNode
        ? { ...(config?.headers || {}), ...data.getHeaders() }
        : config?.headers

    const response = await this.axiosInstance.patch<T>(url, data, { ...config, headers })
    return response.data
  }
}
