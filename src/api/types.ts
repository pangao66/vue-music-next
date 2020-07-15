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

export interface HotKeyData {
  hotkey: HotKeyItem[]
  special_key: string
  special_url: string
}

export interface HotKeyItem {
  k: string
  n: number
}

export interface SearchResultInt {
  album: SearchType
  mv: SearchType
  singer: SearchType
  song: SearchType
}

interface SearchType {
  count: number
  itemlist: SearchItem[]
}

export interface SearchItem {
  docid: string
  id: string
  mid: string
  name: string
  singer: string
  pic?: string
  vid?: string
  type?: 'singer' | 'song'
}
