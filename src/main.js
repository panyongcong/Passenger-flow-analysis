// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import Vuex from 'vuex'
import axios from 'axios'
import VCharts from 'v-charts'
import ElementUI from 'element-ui'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import db from './utils/localstorage'
import 'element-ui/lib/theme-chalk/index.css'
import fastClick from 'fastclick'
import './assets/styles/reset.css'
import './assets/styles/border.css'
import echarts from 'echarts'
import vueJsonp from 'vue-jsonp'
import BaiduMap from 'vue-baidu-map'
import qs from 'qs'
Vue.use(BaiduMap, {
  /* 申请的百度密钥，可以在百度地图官网申请 */
  ak: 'OSCnM1z1OLFZMMrqjevm77yy8fbYMxbT'
})
Vue.use(vueJsonp)
Vue.prototype.$echarts = echarts
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(Antd)
Vue.use(VCharts)
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.config.productionTip = false
fastClick.attach(document.body)
/* eslint-disable no-new */
Vue.use({
  install (Vue) {
    Vue.prototype.$db = db
  }
})
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

axios.interceptors.request.use(
  config => {
    if (config.url === '/register' || config.url === '/login') { // 如果是登录和注册操作，则不需要携带header里面的token
    } else {
      if (localStorage.getItem('Authorization')) {
        config.headers.Authorization = localStorage.getItem('Authorization')
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  })
// 异步请求后，判断token是否过期
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    let _this = this
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('Authorization')
          _this.$router.push('/login')
      }
    }
  }
)
// 异步请求前判断请求的连接是否需要token
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    let token = localStorage.getItem('Authorization')
    console.log('我是浏览器本地缓存的token: ' + token)
    if (token === 'null' || token === '') {
      next('/login')
    } else {
      next()
    }
  }
})
