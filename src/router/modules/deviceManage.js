const deviceManage = {
    path: 'deviceManage',
    name: 'deviceManage',
    meta: {
      title: '设备管理',
      icon: 'icon-device',
      rank: 4
    },
    component: () => import('@/views/deviceManage/index.vue'),
    redirect: '/deviceManage/deviceList',
    children: [
        {
          path: '/deviceList',
          name: 'deviceList',
          meta: {
            title: '设备列表',
          },
          component: () => import('@/views/deviceManage/deviceList/index.vue'),
        },
        {
            path: '/addDevice',
            name: 'addDevice',
            meta: {
              title: '添加设备',
              hide: true
            },
            component: () => import('@/views/deviceManage/deviceList/addDevice.vue'),
        },
        {
            path: '/editDevice',
            name: 'editDevice',
            meta: {
              title: '修改设备',
              hide: true,
              isBottomTool: true,
            },
            component: () => import('@/views/deviceManage/deviceList/editDevice.vue'),
        },
        {
            path: '/deviceDetail',
            name: 'deviceDetail',
            meta: {
              title: '设备详情',
              hide: true,
              isBottomTool: false,
            },
            component: () => import('@/views/deviceManage/deviceList/deviceDetail.vue'),
        },
        {
          path: '/dataPointList',
          name: 'dataPointList',
          meta: {
            title: '数据点列表',
          },
          component: () => import('@/views/deviceManage/dataPointList/index.vue'),
        }]
  }
  export default deviceManage
