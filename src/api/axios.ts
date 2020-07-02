// 引入axios和定义在node_modules/axios/index.ts文件里的类型声明
import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise, AxiosResponse, Method } from 'axios'
import { HttpRequestType, ResponseData } from './types'

const apiBaseUrl = process.env.VUE_APP_DOMAIN

class HttpRequest implements HttpRequestType {


  constructor (public baseUrl: string = apiBaseUrl) {
    this.baseUrl = baseUrl
  }

  public request<T> (options: AxiosRequestConfig): AxiosPromise<ResponseData<T>> { // 我们实际调用接口的时候调用实例的这个方法，他返回一个AxiosPromise
    const instance: AxiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/json'
      },
      // withCredentials: true
    }) // 这里使用axios.create方法创建一个axios实例，他是一个函数，同时这个函数包含多个属性
    options = this.mergeConfig(options) // 合并基础路径和每个接口单独传入的配置，比如url、参数等
    this.interceptors(instance, options, options.url) // 调用interceptors方法使拦截器生效
    return instance(options) // 最后返回AxiosPromise
  }

  public get<T> (url: string, config?: AxiosRequestConfig): AxiosPromise<ResponseData<T>> {
    return this.request<T>({...config, url, method: 'GET'})
  }

  public post<T> (url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<ResponseData<T>> {
    return this.request<T>({...config, data, url, method: 'POST'})
  }

  public delete<T> (url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<ResponseData<T>> {
    return this.request<T>({...config, data, url, method: 'DELETE'})
  }

  public downloadFile (url: string, method: Method = 'GET', config?: AxiosRequestConfig): AxiosPromise<ResponseData> {
    const instance: AxiosInstance = axios.create() // 这里使用axios.create方法创建一个axios实例，他是一个函数，同时这个函数包含多个属性
    return this.request({
      url,
      method,
      responseType: 'blob',
      ...config
    })
  }

  private interceptors (instance: AxiosInstance, options: AxiosRequestConfig, url?: string) { // 定义这个函数用于添加全局请求和响应拦截逻辑
    // 在这里添加请求和响应拦截
    instance.interceptors.request.use(async (config: AxiosRequestConfig) => {
        // 接口请求的所有配置，都在这个config对象中，他的类型是AxiosRequestConfig，你可以看到他有哪些字段
        // 如果你要修改接口请求配置，需要修改 axios.defaults 上的字段值
        // config.headers.Authorization = localStorage.getItem('Authorization')
        return config
      },
      (error) => {
        return Promise.reject(error)
      })
    instance.interceptors.response.use((res: AxiosResponse) => {
        return res // 返回数据
      },
      (error) => { // 这里是遇到报错的回调
        return Promise.reject(error.response)
      })
  }

  private mergeConfig (options: AxiosRequestConfig): AxiosRequestConfig { // 这个方法用于合并基础路径配置和接口单独配置
    return Object.assign({baseURL: this.baseUrl}, options)
  }
}

export default HttpRequest
