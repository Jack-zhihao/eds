<template>
  <div class="siderContent g-scrollbar-y">
    <a-menu
      :selectedKeys="menuSelectedKeys"
      :openKeys="menuOpenKeys"
      theme="light"
      mode="inline"
      :default-selected-keys="[]"
      @click="handleCLick"
      @select="handleSelect"
      @openChange="openChange"
      class="g-scrollbar-y"
    >
      <template v-for="item in menuList">
        <a-menu-item v-if="!item.children" :key="item.path">
          <span :class="item.icon"></span>
          <span v-if="!isCollapsed" class="menu-title">{{ item.title }}</span>
        </a-menu-item>
        <sub-menu v-else :key="'sub' + item.path" :menu-info="item" />
      </template>
    </a-menu>
  </div>
</template>

<script setup>
import subMenu from './subMenu.vue'
import { computed, watchEffect, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
const Store = useStore()
const Router = useRouter()
const Route = useRoute()
const menuList = computed(() => {
  return Store.getters.menuList
})

const initMenuList = () => {
  Store.dispatch('menuInfo/generateMenu')
}
initMenuList()

const menuOpenKeys = computed(() => {
  return Store.getters.menuOpenKeys
})
const menuSelectedKeys = computed(() => {
  return Store.getters.menuSelectedKeys
})
const isCollapsed = computed(() => {
  return Store.getters.isCollapsed
})

const handleSelect = ({ item, key, selectedKeys }) => {
  Store.commit('menuInfo/SET_selectedKeys', selectedKeys)
}
const openChange = keys => {
  Store.commit('menuInfo/SET_openKeys', keys)
}
const handleCLick = ({ key }) => {
    if (['/bigScreen'].includes(key)) {
        const _blank = Router.resolve({
            name: 'fullScreen',
        });
        window.open(_blank.href, '_blank');
        return
    }
    Router.push({ path: key })
}
watchEffect(() => {
  const { matched: matchList } = Route
  const validList = matchList.filter(item => {
    return !item.meta.hide && item.path !== '/'
  })
  const [select, ...open] = validList.reverse()
  const openKeys = open.map(item => item.name)
  openChange(openKeys.length ? openKeys : [select.name])

  const selectedKeys = [openKeys.length ? select.path : select.name]
  handleSelect({ selectedKeys })
})
</script>

<style lang="less">
@import url('@/styles/theme.less');

.siderContent {
    max-height: calc(100% - 46px);
    overflow-y: auto;
}
.ant-menu {
    background-color: @main-bg-color !important;
    color: @main-text-color !important;
    &.ant-menu-inline {
      border: none;
    }
    .ant-menu-item {
      color: @main-text-color !important;
    }
    .ant-menu-sub.ant-menu-inline {
      background-color: @sub-bg-color !important;
      .ant-menu-item {

      }
    }
    .ant-menu-submenu-arrow {
      color: @main-text-color !important;
    }
}

.menu-title {
    margin-left: 20px;
}
</style>
