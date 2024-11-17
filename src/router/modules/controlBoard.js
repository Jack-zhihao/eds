const controlBoard = {
  path: 'controlBoard',
  name: 'controlBoard',
  meta: {
    title: '控制台',
    icon: 'icon-dashboard',
    rank: 2
  },
  component: () => import('@/views/controlBoard/index.vue'),
}
export default controlBoard
