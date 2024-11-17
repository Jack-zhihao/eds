<template>
  <a-sub-menu :key="menuInfo.path">
    <template #title>
      <span :class="menuInfo.icon"></span>
      <span v-if="!isCollapsed" class="menu-title">{{ menuInfo.title }}</span>
    </template>
    <template v-for="item in menuInfo.children">
      <a-menu-item v-if="!item.children" :key="item.path">
        <span>{{ item.title }}</span>
      </a-menu-item>
      <sub-menu v-else :key="'sub' + item.path" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
const Store = useStore()
defineProps({
  menuInfo: Object,
})

const isCollapsed = computed(() => {
  return Store.getters.isCollapsed
})
</script>
<style>
.menu-title {
    margin-left: 20px;
}
</style>
