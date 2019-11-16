import request from '@/utils/request'

// 导出
export const login = (data) => {
  return request('/app/v1_0/authorizations', 'post', data)
}
