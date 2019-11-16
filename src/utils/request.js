// 提供一个配置好的axios请求的函数（调用接口）
import axios from 'axios'
import JSONBIGINT from 'json-bigint'
import store from '@/store'
import router from '@/router'

// 创建一个新的axios实例
const instance = axios.create({
  // 基准值
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 转换响应数据格式
  transformResponse: [(data) => {
    // data 是原始数据格式
    try {
      return JSONBIGINT.parse(data)
    } catch (e) {
      return data
    }
  }]
})

// 请求拦截器  追加token到请求头
instance.interceptors.request.use(config => {
  // 拦截成功
  // 获取token (vuex中的state中user中token)
  if (store.state.user.token) {
    // 追加token
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, err => Promise.reject(err))

// 响应拦截器  1. 获取有效数据  2. token的延长有效期 TODO
instance.interceptors.response.use(res => {
  // 原始的res是什么格式返回什么格式
  // 剥离无效数据  有效数据 res.data.data
  // 注意：有时候并不叫data  有些时候连响应主体都没有
  try {
    return res.data.data
  } catch (e) {
    return res
  }
}, async err => {
  // 如果请求失败，执行这个函数
  // 1、判断是否401状态
  // 是，判断是不是登录
  // 没有登录，拦截到登录页面（登录完了需要回跳）
  // 已经登录，token失效 刷新token请求
  // 2、刷新成功，更新vuex和本地token
  // 把之前失败的请求继续发送出去
  // 刷新失败， 拦截到登录页面（ 登录完了需要回跳）

  // 判断状态
  if (err.response && err.response.status === 401) {
    // 判断成功
    // 跳转到登录的地址，获取当前访问的路由地址使用router  复用
    const loginConfig = { path: '/login', query: { redirectUrl: router.currentRoute.path } }
    // 获取用户信息
    const user = store.state.user
    // 判断是否登录
    if (!user || !user.token || !user.refresh_token) {
      // 没有登录
      // 跳转到登录页面
      return router.push(loginConfig)
    }
    try {
      // 登录
      // 刷新token 请求token请求
      const {
        data: {
          data
        }
      } = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 更新token
      store.commit('setUser', {
        token: data.token,
        refresh_token: user.refresh_token
      })
      // 发送之前失败的请求
      return instance(err.config)
    } catch (e) {
      // 刷新失败
      store.commit('delUser')
      return router.push(loginConfig)
    }
  }
  return Promise.reject(err)
})

// 调用接口 (接口地址，请求方式，传参)
export default (url, method, data) => {
  // params 选项是 get传参
  // data 选项是 其他请求方式的传参
  return instance({
    url,
    method,
    // js表达式运行的结果必须是字符串（params|data）
    // 严谨处理  get Get GET 都认为是get
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
