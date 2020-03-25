import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import home from '@/pages/home'
import register from '@/pages/register'
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        requireAuth: true
      },
      component: home,
      children: [
        {
          path: '/device',
          name: 'device',
          component: () => import('@/pages/device')
        },
        {
          path: '/shopinfo',
          name: 'shopinfo',
          component: () => import('@/pages/shopinfo')
        },
        {
          path: '/system',
          name: 'system',
          component: () => import('@/pages/system'),
          meta: {
            title: '首页', // 菜单名称
            roles: ['staff', 'admin', 'boss'] // 当前菜单哪些角色可以看到
          }
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/pages/profile')
        },
        {
          path: '/probeinfo',
          name: 'probeinfo',
          component: () => import('@/pages/probeinfo')
        },
        {
          path: '/Administrators',
          name: 'Administrators',
          component: () => import('@/pages/Administrators')
        },
        {
          path: '/Probelist',
          name: 'Probelist',
          component: () => import('@/pages/Probelist')
        }
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: register
    }
  ]
})
/*
export const fixedRouter = [{
  path: '/',
  name: 'login',
  component: login
},
{
  path: '/home',
  name: 'home',
  meta: {
    requireAuth: true
  },
  component: home, // 整体页面的布局(包含左侧菜单跟主内容区域)
  children: [{
    path: 'main',
    component: main,
    meta: {
      title: '首页', // 菜单名称
      roles: ['user', 'admin'], // 当前菜单哪些角色可以看到
      icon: 'el-icon-info' // 菜单左侧的icon图标
    }
  }]
}
]
*/
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    let token = localStorage.getItem('Authorization')

    if (token === 'null' || token === '') {
      next('/login')
    } else {
      next()
    }
  }
})
export default router
