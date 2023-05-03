import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useTokenStore } from '@/stores/token'

export const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000
})

service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response.status === 422) {
      console.error('Request Illegal: ', error.response.data)
      ElMessage.error('请求非法。')
      return Promise.reject(error)
    } else if (error.response.status === 401) {
      const tokenStore = useTokenStore()
      console.error('Unauthorized: ', error.response.data.detail)
      tokenStore.token = ''
      return Promise.reject(error)
    } else if (error.response.status === 500) {
      console.error('Server Error: ', error.response.data.detail)
      ElMessage.error('服务器错误。')
      return Promise.reject(error)
    } else {
      return Promise.reject(error)
    }
  }
)

service.interceptors.request.use(
  (config) => {
    const tokenStore = useTokenStore()
    if (tokenStore.token) {
      config.headers.Authorization = 'Bearer ' + tokenStore.token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
