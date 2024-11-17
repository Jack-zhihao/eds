<template>
    <a-modal v-model:visible="props.visibleScene" :centered="true" :closable="false" :footer="null"
        :bodyStyle="{ width: '700px', height: '300px' }" :width="700" class="common-modal">
        <div class="header">
            <p class="title">场景详情</p>
            <span class="icon-close" @click="handleBack"></span>
        </div>
        <div class="view-scene-content">
            <div class="view-scene-pane">
                <div class="view-scene-item">
                    <span class="label">场景状态</span>
                    <span class="value">{{ sceneForm.scene_status }}</span>
                </div>
                <div class="view-scene-item">
                    <span class="label">分类标签</span>
                    <span class="value">{{ sceneForm.category_name }}</span>
                </div>
                <div class="view-scene-item">
                    <span class="label">场景名称</span>
                    <span class="value">{{ sceneForm.scene_name }}</span>
                </div>
                <div class="view-scene-item">
                    <span class="label">关联设备数</span>
                    <span class="value">{{ sceneForm.devices_count }}</span>
                </div>
                <div class="view-scene-item">
                    <span class="label">创建时间</span>
                    <span class="value">{{ sceneForm.created_at }}</span>
                </div>
            </div>
            <div class="view-scene-pane">
                <div class="view-scene-item">
                    <span class="label">所属组织</span>
                    <span class="value">{{ sceneForm.organization_name }}</span>
                </div>

                <div class="view-scene-item">
                    <span class="label">场景名称</span>
                    <span class="value">{{ sceneForm.scene_name }}</span>
                </div>
                <div class="view-scene-item">
                    <span class="label">ToPic</span>
                    <span class="value">{{ sceneForm.mqtt_topic }}</span>
                </div>

                <div class="view-scene-item">
                    <span class="label">关联摄像头</span>
                    <span class="value">{{ sceneForm.cameras_count }}</span>
                </div>
                <div class="view-scene-item">
                    <span class="label">更新时间</span>
                    <span class="value">{{ sceneForm.updated_at }}</span>
                </div>
            </div>
        </div>
        <div class="view-scene-item">
            <span class="label">场景描述</span>
            <span class="value">{{ sceneForm.description }}</span>
        </div>
        <div class="common-tool-warp">
            <a-button class="cancel-btn" type="default" @click="handleBack">关闭</a-button>
        </div>
    </a-modal>
</template>
<script setup>
import { defineEmits, defineProps, ref, onMounted } from 'vue'
const props = defineProps({
    visibleScene: {
        type: Boolean,
        default: false
    },
    scene: {
        type: Object,
        default: () => { }
    }
})
const sceneForm = ref({})
const emit = defineEmits(['update:visible'])
const handleBack = () => {
    emit('update:visible', false)
}

onMounted(() => {
    sceneForm.value = props.scene
})

</script>
<style lang="less">
@import url('@/styles/theme.less');
.view-scene-content {
    display: flex;

    .view-scene-pane {
        width: 50%
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
