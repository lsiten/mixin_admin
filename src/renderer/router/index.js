import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      total: 0,
      current_page: 1,
      page_size: 12
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: {title: '自述文件'},
      children: [
        {
          name: 'dashboard',
          path: '/dashboard',
          component: resolve => require(['../components/page/Dashboard.vue'], resolve),
          meta: {title: '系统首页', permission: true}
        },
        {
          path: '/users',
          component: resolve => require(['../components/page/user/users.vue'], resolve),
          meta: {title: '用户管理', permission: true}
        },
        {
          path: '/category',
          component: resolve => require(['../components/page/category/category.vue'], resolve),
          meta: {title: '分类管理', permission: true}
        },
        {
          path: '/foods',
          name: 'foods',
          component: resolve => require(['../components/page/food/food.vue'], resolve),
          meta: {title: '商品管理', permission: true}
        },
        {
          path: '/desk',
          name: 'desk',
          component: resolve => require(['../components/page/desk/desk.vue'], resolve),
          meta: {title: '桌号管理', permission: true}
        },
        {
          path: '/order',
          component: resolve => require(['../components/page/order/order.vue'], resolve),
          meta: {title: '订单管理', permission: true}
        },
        {
          path: '/banner',
          component: resolve => require(['../components/page/banner/banner.vue'], resolve),
          meta: {title: 'banner管理', permission: true}
        },
        {
          path: '/setting',
          component: resolve => require(['../components/page/setting/setting.vue'], resolve),
          meta: {title: '系统设置', permission: true}
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
      name: '404',
      path: '/404',
      component: resolve => require(['../components/page/404.vue'], resolve)
    },
    {
      name: '403',
      path: '/403',
      component: resolve => require(['../components/page/403.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
