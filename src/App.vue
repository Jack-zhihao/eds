<template>
  <a-config-provider :locale="zhCN">
    <router-view></router-view>
  </a-config-provider>
</template>

<script setup>
import '@/styles/common.less'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { onMounted, provide } from 'vue'
import { useStore } from 'vuex'
import { switchTheme } from '@/styles/theme'
import Mitt from 'mitt';
const Store = useStore()
const eventBus = Mitt()
provide('eventBus', eventBus)
onMounted(() => {
  let theme = Store.getters.theme
  if (!theme) Store.commit('appInfo/SET_Theme', 'light')
  switchTheme(theme || 'light')
})
</script>

<style lang="less"></style>
