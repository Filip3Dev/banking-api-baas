export interface HttpConfig {
  headers?: Record<string, string>
  params?: Record<string, unknown>
  validateStatus?: (status: number) => boolean
}

export type HttpPayload = Record<string, unknown>
export type HttpResponse<T> = {
  data: T
  status: number
  statusText: string
}

export interface HttpClient {
  get<T>(url: string, config?: HttpConfig): Promise<HttpResponse<T>>
  post<T>(url: string, data?: HttpPayload, config?: HttpConfig): Promise<HttpResponse<T>>
}
