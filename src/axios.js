import axios from 'axios'
import store from './store'
import router from './router'
import { showLoading, hideLoading } from './loading'
var instance = axios.create({
  timeout: 5000,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})
instance.interceptors.request.use(
  config => {
    if (store.state.token) {
      config.headers.Authorization = `token ${store.state.token}`
    }
    showLoading()
    return config
  }
)
instance.interceptors.response.use(
  response => {
    hideLoading()
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.replace({
            path: 'Home',
            query: { redirect: router.currentRoute.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
      }
    }
    hideLoading()
    return Promise.reject(error.response)
  }
)

export default {
  userRegister (data) {
    return instance.post('/api/register', data)
  },
  userLogin (data) {
    return instance.post('/api/login', data)
  },

  getUser () {
    return instance.get('/api/user')
  },
  delUser (data) {
    return instance.post('/api/delUser', data)
  }

}
