import { service } from '@/hooks/request'
import qs from 'qs'

export interface TokenReturn {
  access_token: string
  token_type: string
}

export function postLogin(data: {
  username: string
  password: string
  scope: string
}): Promise<TokenReturn> {
  return service({
    url: '/auth/login',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}
