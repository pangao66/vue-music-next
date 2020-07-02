import { AxiosRequestConfig, AxiosPromise } from 'axios'


export interface ResponseData<T = any> {
  success: boolean
  data: T;
}

export interface HttpRequestType {

  baseUrl?: string

  request<T> (options: AxiosRequestConfig): AxiosPromise<ResponseData<T>>

  get<T> (url: string, config?: AxiosRequestConfig): AxiosPromise<ResponseData<T>>

  post<T> (url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<ResponseData<T>>
}
