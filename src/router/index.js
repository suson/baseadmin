import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: false,
    children: [{
      path: 'dashboard',
      meta: { title: '首页', icon: 'home' },
      component: () => import('@/views/dashboard/index')
      // component: () => import('@/views/baidu/speed')
    }]
  },

  {
    path: '/baidu_task',
    component: Layout,
    redirect: '/baidu_task',
    name: '百度任务',
    alwaysShow: true,
    meta: { title: '百度任务', icon: 'baidu' },
    children: [
      {
        path: 'speed',
        name: '百度极速排名',
        component: () => import('@/views/baidu/speed'),
        meta: { title: '百度极速排名', icon: '' }
      },
      {
        path: 'add',
        name: '添加百度极速排名',
        hidden: true,
        component: () => import('@/views/baidu/saveSpeed'),
        meta: { title: '添加百度极速排名', icon: '' }
      },
      {
        path: 'edit/:id(\\d+)',
        name: '修改百度极速排名',
        hidden: true,
        component: () => import('@/views/baidu/saveSpeed'),
        meta: { title: '修改百度极速排名', icon: '', isEdit:true }
      }
    ]
  },
  {
    path: '/360_task',
    component: Layout,
    redirect: '/360task',
    name: '360搜索',
    alwaysShow: true,
    meta: { title: '360搜索', icon: '360' },
    children: [
      {
        path: 'speed',
        name: '360排名',
        component: () => import('@/views/360/speed'),
        meta: { title: '360排名', icon: '' }
      },
      {
        path: 'add',
        name: '添加360排名',
        hidden: true,
        component: () => import('@/views/360/saveSpeed'),
        meta: { title: '添加360排名', icon: '' }
      },
      {
        path: 'edit/:id(\\d+)',
        name: '修改360排名',
        hidden: true,
        component: () => import('@/views/360/saveSpeed'),
        meta: { title: '修改360排名', icon: '', isEdit:true }
      }
    ]
  },
  {
    path: '/sogou_task',
    component: Layout,
    redirect: '/sogou_task',
    name: '搜狗搜索',
    alwaysShow: true,
    meta: { title: '搜狗搜索', icon: 'sogou' },
    children: [
      {
        path: 'speed',
        name: '搜狗排名',
        component: () => import('@/views/sogou/speed'),
        meta: { title: '搜狗排名', icon: '' }
      },
      {
        path: 'add',
        name: '添加搜狗排名',
        hidden: true,
        component: () => import('@/views/sogou/saveSpeed'),
        meta: { title: '添加搜狗排名', icon: '' }
      },
      {
        path: 'edit/:id(\\d+)',
        name: '修改搜狗排名',
        hidden: true,
        component: () => import('@/views/sogou/saveSpeed'),
        meta: { title: '修改搜狗排名', icon: '', isEdit:true }
      }
    ]
  },
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },
  {
    path: '',
    component: Layout,
    name: '首页',
    hidden: false,
    children: [{
      path: 'logout',
      meta: { title: '退出', icon: 'link' }
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
