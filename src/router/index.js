import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // 如果访问的是'/'，就重定向到'/login'页面
    redirect: '/login'
  },
  {
    path:'/login',
    component: Login
  },
  {
    path:'/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 表示将要访问的路径
  // from 表示从那个路径来
  // next 是一个函数,代表放行
  //        next()放行   next('/path') 强制跳转到执行路径
  if(to.path === '/login') return next()
  // 除了login页面其他页面必须验证token
  let tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) {
    return next('/login')
  }
  next()
})
export default router
