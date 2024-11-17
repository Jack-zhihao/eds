const sceneManage = {
    path: 'sceneManage',
    name: 'sceneManage',
    meta: {
      title: '场景管理',
      icon: 'icon-scenario',
      rank: 3
    },
    component: () => import('@/views/sceneManage/index.vue'),
    redirect: '/sceneManage/sceneList',
    children: [
        {
          path: '/sceneList',
          name: 'sceneList',
          meta: {
            title: '场景列表',
          },
          component: () => import('@/views/sceneManage/sceneList/index.vue'),
        }
    ]
}

export default sceneManage
