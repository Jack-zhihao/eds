const screen = {
    path: '/bigScreen',
    name: 'bigScreen',
    meta: {
      title: '数据大屏',
      icon: 'icon-screen',
      rank: 1
    },
    component: () => import('@/views/bigScreen/index.vue')
}

export default screen
