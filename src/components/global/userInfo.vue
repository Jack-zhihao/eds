<template>
    <a-modal v-model:visible="props.visible" :centered="true" :closable="false" :footer="null"
        :bodyStyle="{ width: '600px', height: '300px' }" :width="600" class="common-modal">
        <div class="header">
            <p class="title">个人中心</p>
             <span class="icon-close" @click="handleBack"></span>
        </div>
       <div class="view-user-warp">
        <!-- <div class="view-avatar-warp">
            <img :src="form.avatar" alt="头像错误">
        </div> -->
        <div class="view-content">
            <div class="view-user-item">
                <span class="label">用户名</span>
                <span class="value">{{ form.name }}</span>
            </div>
            <div class="view-user-item">
                <span class="label">用户邮箱</span>
                <span class="value">{{ form.email }}</span>
            </div>
            <div class="view-user-item">
                <span class="label">创建账号时间</span>
                <span class="value">{{ form.created_at }}</span>
            </div>
        </div>
       </div>
    </a-modal>
</template>
<script setup>
import { defineEmits, defineProps, ref, onMounted } from 'vue'
import { getUser } from '@/utils/auth.js'
import moment from 'moment'
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
})
const form = ref({})
const emit = defineEmits(['update:visible'])
const handleBack = () => {
    emit('update:visible', false)
}

onMounted(() => {
    const user = getUser() || {}
    const created_at = moment(new Date(user.created_at)).format('YYYY-MM-DD HH:mm:ss')
    form.value = Object.assign({}, user, {created_at})
})

</script>
<style lang="less">
@import url('@/styles/theme.less');
.view-user-warp {
    display: flex;
    .view-avatar-warp {
        width: 200px;
        margin-right: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            width: 100px;
            height: 100px;
            background-color: #f1f1f1;
            border-radius: 100px;
            border: 1px solid #bbb;
            text-align: center;
        }
    }
}
.view-content {
    width: 100%;
    display: flex;
    flex-direction: column;

.view-user-item {
    display: flex;
    line-height: 1;

    margin-bottom: 20px;
    .label {
        display: block;
        width: 72px;
        flex-shrink: 0;
        color: @main-text-color;
    }

    .value {
        width: 100%;
        margin-left: 30px;
        color: rgba(130, 130, 130, 1);
    }
}
}
</style>
