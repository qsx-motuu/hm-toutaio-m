// 文章列表相关接口
import request from '@/utils/request'

export const getArticle = (channelId, timestamp) => {
  return request('app/v1_1/articles', 'get', {
    channel_id: channelId,
    timestamp,
    with_top: 1
  })
}
