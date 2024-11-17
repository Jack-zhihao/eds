<template>
    <a-modal v-model:visible="props.visibleOrg" :centered="true" :closable="false" :footer="null"
        :bodyStyle="{ width: '600px', height: '280px' }" :width="600" class="common-modal">
        <div class="header">
            <p class="title">场景详情</p>
            <span class="icon-close" @click="handleBack"></span>
        </div>
        <div class="view-scene-content">
            <div class="view-scene-pane">
                <div class="view-scene-item">
                    <span class="label">组织名称</span>
                    <span class="value">{{ orgForm.organization_name }}</span>
                </div>
                <div class="view-scene-item">
                    <span class="label">上级组织</span>
                    <span class="value">{{ orgForm.parent_id }}</span>
                </div>
                <div class="view-scene-item">
                    <span class="label">关联设备数</span>
                    <span class="value">{{ orgForm.devices_count }}</span>
                </div>
                <div class="view-scene-item">
                    <span class="label">创建时间</span>
                    <span class="value">{{ moment(orgForm.created_at).format('YYYY-MM-DD HH:mm:ss') }}</span>
                </div>
                <div class="view-scene-item">
                    <span class="label">创建时间</span>
                    <span class="value">{{ moment(orgForm.updated_at).format('YYYY-MM-DD HH:mm:ss') }}</span>
                </div>
            </div>
        </div>
        <div class="common-tool-warp">
            <a-button class="cancel-btn" type="default" @click="handleBack">关闭</a-button>
        </div>
    </a-modal>
</template>
<script setup>
import { defineEmits, defineProps, ref, onMounted } from 'vue'
import moment from 'moment'

const props = defineProps({
    visibleOrg: {
        type: Boolean,
        default: false
    },
    org: {
        type: Object,
        default: () => { }
    }
})
const orgForm = ref({})
const emit = defineEmits(['update:visible'])
const handleBack = () => {
    emit('update:visible', false)
}

onMounted(() => {
    orgForm.value = props.org
})

</script>
<style lang="less">
@import url('@/styles/theme.less');
.view-scene-content {
    display: flex;

    .view-scene-pane {
        width: 100%
    }
}

.view-scene-item {
    display: flex;
    margin-top: 12px;
    line-height: 1;

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
</style>
