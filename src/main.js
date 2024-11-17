import { createApp } from 'vue'
import App from './App.vue'
import Router from './router'
import Store from './store'
import 'normalize.css' // 样式重置各浏览器统一
import './styles/nprogress.less'
import './styles/global.less' // 全局样式
import Antd from 'ant-design-vue'
import './permisson' // 权限
import components from './components/global' // 全局组件
import directives from './directives' // 全局指令
import 'moment/dist/locale/zh-cn'
import './styles/overwirte.less' // ant 覆盖样式
import './styles/icomoom.css'
import '@/utils/amap.js'
const app = createApp(App)

app.config.productionTip = false
// 注册全局组件
for (const i in components) {
  app.component(i, components[i])
}
// // 注册全局指令
for (const i in directives) {
  app.directive(i, directives[i])
}
app.use(Router)
app.use(Antd)
app.use(Store)
app.mount('#app')
