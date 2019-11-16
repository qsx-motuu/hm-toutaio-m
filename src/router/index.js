import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home/Index')
const Question = () => import('@/views/question/Index')
const Video = () => import('@/views/video/Index')
const User = () => import('@/views/user/Index')
const UserProfile = () => import('@/views/user/Profile')
const UserChat = () => import('@/views/user/Chat')
const Login = () => import('@/views/user/Login')
const Search = () => import('@/views/search/Index')
const SearchResult = () => import('@/views/search/Result')
const Article = () => import('@/views/home/Index')

Vue.use(VueRouter)

const routes = [
  // 公共布局相关
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        path: '/question',
        name: 'question',
        component: Question
      },
      {
        path: '/video',
        name: 'video',
        component: Video
      },
      {
        path: '/user',
        name: 'user',
        component: User
      }
    ]
  },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: UserProfile
  },
  {
    path: '/user/chat',
    name: 'user-chat',
    component: UserChat
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  {
    path: '/search/result',
    name: 'search-result',
    component: SearchResult
  },
  {
    path: '/article',
    name: 'article',
    component: Article
  }
]

const router = new VueRouter({
  routes
})

// 登录拦截
// 访问权限控制 /user 下的
router.beforeEach((to, from, next) => {
  // 获取用户信息
  const user = store.state.user
  // 判断当前token和当前地址
  if (!user.token && to.path.startsWith('/user')) {
    return next({
      path: '/login',
      query: {
        redirectUrl: to.path
      }
    })
  }
  next()
})

export default router
