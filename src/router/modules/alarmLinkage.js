const alarmLinkage = {
    path: 'alarmLinkage',
    name: 'alarmLinkage',
    meta: {
      title: '报警联动',
      icon: 'icon-alarm',
      rank: 7
    },
    component: () => import('@/views/alarmLinkage/index.vue'),
    redirect: '/alarmLinkage/alarmTriggerList',
    children: [
        {
          path: '/alarmTriggerList',
          name: 'alarmTriggerList',
          meta: {
            title: '报警触发器列表',
          },
          component: () => import('@/views/alarmLinkage/alarmTriggerList/index.vue'),
        }
    ]
}

export default alarmLinkage
