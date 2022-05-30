import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入第三方图标库（用的阿里图标库）
import './assets/fonts/iconfont.css'
// 导入axios包并绑定到vue的原型上
// 添加到原型上后，可以在每个组件上通过this.$http获取axios，不必每个页面都import axios，$http是自定义的属性名，可以随便起
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 将axios挂载到vue原型之前，添加请求拦截器（request），将Authorization字段添加到请求头中
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return
  return config
})
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
