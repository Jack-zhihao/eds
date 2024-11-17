const staticRoutes = [
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录',
      },
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/',
      name: 'app',
      meta: {
        title: '',
      },
      redirect: '/controlBoard',
      component: () => import('@/layout/index.vue'),
    },
    {
      path: '/notFound',
      name: 'notFound',
      component: () => import('@/views/notFound/index.vue'),
      meta: {
        title: '找不到路径',
      },
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/notFound',
    },
    {
        path: '/fullScreen',
        name: 'fullScreen',
        meta: {
            title: '数据大屏',
        },
        component: () => import('@/views/bigScreen/index.vue'),
    }
]

export default staticRoutes
