const scheduledManage = {
    path: 'scheduledManage',
    name: 'scheduledManage',
    meta: {
      title: '定时任务',
      icon: 'icon-timeTrial',
      rank: 8
    },
    component: () => import('@/views/scheduledManage/index.vue'),
    redirect: '/scheduledManage/scheduledList',
    children: [
        {
          path: '/scheduledList',
          name: 'scheduledList',
          meta: {
            title: '定时任务列表',
          },
          component: () => import('@/views/scheduledManage/scheduledList/index.vue'),
        }
    ]
}

export default scheduledManage
