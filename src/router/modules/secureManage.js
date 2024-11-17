const secureManage = {
    path: 'secureManage',
    name: 'secureManage',
    meta: {
      title: '安防管理',
      icon: 'icon-secure',
      rank: 5
    },
    component: () => import('@/views/secureManage/index.vue'),
    redirect: '/secureManage/cameraList',
    children: [
        {
          path: '/cameraList',
          name: 'cameraList',
          meta: {
            title: '摄像头列表'
          },
          component: () => import('@/views/secureManage/cameraList/index.vue'),
        }
    ]
}

export default secureManage
