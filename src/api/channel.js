/**
 * 获取我的频道信息（如果没有登录，获取后台设置的默认频道信息）
 */
// 导入
import request from '@/utils/request'

// 注册信息，请求接口
export const getMyChannels = () => {
  return request('/app/v1_0/user/channels', 'get')
}
