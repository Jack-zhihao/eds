const dataCenter = {
    path: 'dataCenter',
    name: 'dataCenter',
    meta: {
      title: '数据中心',
      icon: 'icon-data',
      rank: 8
    },
    component: () => import('@/views/dataCenter/index.vue'),
    redirect: '/dataCenter/dataStatistics',
    children: [
        {
          path: '/dataStatistics',
          name: 'dataStatistics',
          meta: {
            title: '数据统计',
          },
          component: () => import('@/views/dataCenter/dataStatistics/index.vue'),
        },
        {
            path: '/tableManage',
            name: 'tableManage',
            meta: {
              title: '报表管理',
            },
            component: () => import('@/views/dataCenter/tableManage/index.vue'),
        },
        {
            path: '/dataHistory',
            name: 'dataHistory',
            meta: {
              title: '历史数据',
            },
            component: () => import('@/views/dataCenter/dataHistory/index.vue'),
        },
        {
            path: '/alarmHistory',
            name: 'alarmHistory',
            meta: {
              title: '报警记录',
            },
            component: () => import('@/views/dataCenter/alarmHistory/index.vue'),
        },
        {
            path: '/linkageHistory',
            name: 'linkageHistory',
            meta: {
              title: '联动记录',
            },
            component: () => import('@/views/dataCenter/linkageHistory/index.vue'),
        }
    ]
}

export default dataCenter
