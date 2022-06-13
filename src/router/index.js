import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/user/Users.vue'
import Roles from '@/components/power/Roles'
import Rights from '@/components/power/Rights'
import Cate from '@/components/goods/Cate'
import Params from '@/components/goods/Params'
import GoodsList from '@/components/goods/List'
import Add from '@/components/goods/Add'
import Breadcrumb from '@/components/public/Breadcrumb' 
Vue.use(VueRouter)

Vue.component('my-bread',Breadcrumb)
const routes = [
  {
    path: '/',
    // 如果访问的是'/'，就重定向到'/login'页面
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    // 当用户访问/home组件时重定向到home的子路由welcome组件
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: Users
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/categories',
      component: Cate
    }, {
      path: '/params',
      component: Params,
    },{
      path: '/goods',
      component: GoodsList,
    },{
      path: '/goods/add',
      component: Add,
    }
    ]
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
  if (to.path === '/login') return next()
  // 除了login页面其他页面必须验证token
  let tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})
export default router
