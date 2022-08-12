import { HttpClientError, HttpClientResponseError } from '_config/http/errors'
import { HttpClient, HttpConfig, HttpPayload, HttpResponse } from '_config/http/types'
import axios, { AxiosInstance } from 'axios'

class HttpClientAxios implements HttpClient {
  instance: AxiosInstance

  constructor(baseURL: string) {
    this.instance = axios.create({ baseURL })
  }

  async get<T>(url: string, config?: HttpConfig): Promise<HttpResponse<T>> {
    try {
      const response = await this.instance.get(url, config)
      const httpResponse: HttpResponse<T> = {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      }
      return httpResponse
    } catch (err) {
      throw new HttpClientResponseError(err as HttpClientError)
    }
  }

  async post<T>(url: string, data?: HttpPayload, config?: HttpConfig): Promise<HttpResponse<T>> {
    try {
      const response = await this.instance.post(url, data, config)
      const httpResponse: HttpResponse<T> = {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      }
      return httpResponse
    } catch (err) {
      throw new HttpClientResponseError(err as HttpClientError)
    }
  }
}

export { HttpClientAxios }
