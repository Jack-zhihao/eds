const secureManage = {
    path: 'setting',
    name: 'setting',
    meta: {
      title: '设置',
      icon: 'icon-setting',
    },
    component: () => import('@/views/setting/index.vue'),
    redirect: '/setting/organizationList',
    children: [
        {
          path: '/organizationList',
          name: 'organizationList',
          meta: {
            title: '组织列表'
          },
          component: () => import('@/views/setting/organizationList/index.vue'),
        }
    ]
}

export default secureManage
