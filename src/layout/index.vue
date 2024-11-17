<template>
  <a-layout :style="layoutStyle">
    <a-layout-header :style="headerStyle">
      <div class="headerBox">
        <div class="left">
          华晟自动化管理平台
        </div>
        <div class="right">
          <img @click="toggleFull" :src="fullscreenSvg" alt="访问失效或地址错误">
          <img @click="handleSwitchTheme" :src="themeSvg" alt="访问失效或地址错误">
          <a-dropdown>
            <a-avatar :size="24" :src="avatar" @click="e => e.preventDefault()" />
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:;" @click="handleVisible(true)">个人中心</a>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item>
                  <a href="javascript:;" @click="loginOut">退出登录</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <user-info :visible="visible" @update:visible="handleVisible"></user-info>
        </div>
      </div>
    </a-layout-header>
    <a-layout :style="layoutStyle">
      <a-layout-sider v-model:collapsed="collapsed" class="layout-sider-warp" :width="220"
        :trigger="null"
        breakpoint="lg"
        @breakpoint="handleBreakpoint"
        >
        <sider-content/>
        <div class="collapsed-menu" @click="handleCollapsed"><span class="icon-collapsed"></span><span v-if="!collapsed" class="collapsed-title">收起侧边栏</span></div>
      </a-layout-sider>
      <a-layout-content :style="contentStyle">
        <!-- 面包屑 添加判断，无子级路由不展示 -->
        <a-breadcrumb class="auto-breadcrumb" v-if="matchList.length > 2">
            <a-breadcrumb-item v-for="(item, index) in matchList" :key="index">
              <router-link :to="{ path: item.path }">
                <span class="icon-dashboard" v-if="item.path === '/'"></span>
                <template v-else>
                  {{ item.meta.title }}
                </template>
              </router-link>
            </a-breadcrumb-item>
          </a-breadcrumb>
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <div id="appContent" class="g-scrollbar" :style="{height: toolRoutes.includes(Route.name) ? 'calc(100% - 70px)' : '100%'}">
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>

</template>

<script setup>
import collapsedIcon from '@/assets/svg/collapsed-icon.svg'
import fullscreenSvg from '@/assets/svg/fullscreen.svg'
import themeSvg from '@/assets/svg/theme.svg'
import { reactive, ref, toRefs, watch, watchEffect, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { BankOutlined } from '@ant-design/icons-vue'
import { removeToken, removeUser } from '@/utils/auth'
import avatar from '@/assets/svg/avatar.svg'
import siderContent from './siderContent.vue'
import { logout } from '@/api/login'
import useFullscreen from '@/hooks/useFullScreen'
import { switchTheme } from '@/styles/theme'

const { toggleFull } = useFullscreen()

const layoutStyle = {
  height: '100%'
}

const headerStyle = {
  height: '46px',
  padding: '0px 18px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
}
const contentStyle = {
  display: 'flex',
  padding: '20px',
  height: 'calc(100vh - 46px)',
  flexDirection: 'column',
  position: 'relative'
}
const Router = useRouter()
const Route = useRoute()
const Store = useStore()

const collapsed = ref(true)
const handleCollapsed = () => {
  collapsed.value = !collapsed.value
  Store.commit('appInfo/SET_Collapsed', collapsed.value)
}

const handleBreakpoint = () => {
    Store.commit('appInfo/SET_Collapsed', !collapsed.value)
}

// 有底部操作栏的路由白名单
const toolRoutes = ['addDevice', 'editDevice']

// 面包屑逻辑
const currentRouteInfo = reactive({
  matchList: [],
})

watchEffect(() => {
  const { matched } = Route
  currentRouteInfo.matchList = [...matched]
})
const { matchList } = {
  ...toRefs(currentRouteInfo),
}

// 个人中心弹出框回调
const visible = ref(false)
const handleVisible = (flag) => {
    visible.value = flag
}

// 退出登录
const loginOut = () => {
  logout().finally(() => {
    removeToken()
    removeUser()
    Router.push({ path: '/login' })
  })
}

// 切换主题
const eventBus = inject('eventBus', (eventBus) => eventBus)
const handleSwitchTheme = () => {
    const map = { 'light': 'dark', 'dark': 'light', '': 'light' }
    const current_theme = Store.getters.theme
    const will_theme = map[current_theme] || 'light'
    Store.commit('appInfo/SET_Theme', will_theme)

    switchTheme(will_theme)
    eventBus.emit('updateTheme', will_theme)
}
</script>

<style lang="less">
@import url('@/styles/theme.less');

.ant-layout {
  background-color: @main-deep-bg-color !important;
}
.ant-layout-header {
  background-color: @main-bg-color !important;
}

.ant-layout-sider {
  background-color: @main-bg-color !important;
}

.ant-layout-content {
  background-color: @main-deep-bg-color !important;
}

.headerBox {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 10px;

.left {
  font-family: PingFang SC;
  font-size: 20px;
  color: @main-text-color;
}

.left,
.right {
  display: flex;
  justify-content: space-between;
  align-items: center;

  > :not(:last-child) {
    margin-right: 22px;
  }
}

}

.auto-breadcrumb {
  flex-shrink: 0;
  line-height: 1;
  margin-bottom: 20px;
  span a {
    color: rgba(158, 158, 158, 1);
    font-size: 12px;
  }
}

#appContent {
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: auto;
  background-color: @main-deep-bg-color;
}

.ant-breadcrumb {
  padding: 0 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 10px !important;
}
.layout-sider-warp {
    .ant-layout-sider-children {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .collapsed-menu {
        height: 46px;
        cursor: pointer;
        overflow: hidden;
        padding: 15px 0;
        box-sizing: border-box;
        display: flex;
        flex-wrap: nowrap;
        .icon-collapsed {
            margin: 0 20px 0 24px;
            color: @main-text-color;
        }
        .collapsed-title {
            display: flex;
            width: 60px;
            align-items: center;
            min-width: 60px;
            line-height: 1;
            transition: all 1s;
            transition-delay: 1s;
            color: @main-text-color;
        }
    }
}

</style>
