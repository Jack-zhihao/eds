<template>
    <a-modal v-model:visible="props.visibleTrigger" :centered="true" :closable="false" :footer="null"
        :bodyStyle="{ width: '624px', height: '390px' }" :width="624" class="common-modal">
        <div class="header">
            <p class="title">触发器信息</p>
            <span class="icon-close" @click="handleBack"></span>
        </div>
        <div class="view-scene-content">

            <div class="view-scene-item">
                <span class="label">触发器名称</span>
                <span class="value">{{ modalForm.trigger_name }}</span>
            </div>
            <div class="view-scene-item">
                <span class="label">所属组织</span>
                <span class="value">{{ modalForm.organization_name }}</span>
            </div>
            <div class="view-scene-item">
                <span class="label">所属设备</span>
                <span class="value">{{ modalForm.device_name }}</span>
            </div>
            <div class="view-scene-item">
                <span class="label">触发条件</span>
                <span class="value">{{ conditionMap[modalForm.condition_identifier]}}<span v-if="['GT', 'LT', 'EQ'].includes(modalForm.condition_identifier)">{{ modalForm.threshold_max }}</span></span>
            </div>
            <div class="view-scene-item">
                <span class="label">启用报警</span>
                <span class="value">
                    <a-switch v-model:checked="modalForm.enable_alarm" :disabled="true"/>
                </span>
            </div>
            <div class="view-scene-item" v-if="modalForm.enable_alarm">
                <span class="label">报警推送内容</span>
                <span class="value">{{ modalForm.alarm_meta.alarm_push_text }}</span>
            </div>

            <div class="view-scene-item">
                <span class="label">启用联动</span>
                <span class="value">
                    <a-switch v-model:checked="modalForm.enable_linkage" :disabled="true"/>
                </span>
            </div>
            <div class="view-scene-item" v-if="modalForm.linkage_meta">
                <span class="label">联动类型</span>
                <span class="value">{{ linkageTypeMap[modalForm.linkage_meta.linkage_type] }}</span>
            </div>

            <div class="view-scene-item" v-if="modalForm.linkage_meta">
                <span class="label">联动数据点</span>
                <span class="value">{{ modalForm.linkage_meta.point_name }}</span>
            </div>
            <div class="view-scene-item" v-if="modalForm.linkage_meta">
                <span class="label">下发内容</span>
                <span class="value">{{ modalForm.linkage_meta.write_data }}</span>
            </div>
        </div>
    </a-modal>
</template>
<script setup>
import { defineEmits, defineProps, ref, onMounted } from 'vue'
import { getDataPoint } from '@/api/deviceManage'
const props = defineProps({
    visibleTrigger: {
        type: Boolean,
        default: false
    },
    trigger: {
        type: Object,
        default: () => { }
    }
})
const modalForm = ref({})
const emit = defineEmits(['update:visible'])
const handleBack = () => {
    emit('update:visible', false)
}

const conditionMap = {
    'ON': '当开关为ON',
    'OFF': '当开关为OFF',
    'GT': '值大于最大阈值',
    'LT': '值小于最小阈值',
    'EQ': '值等于最小阈值',
}

const linkageTypeMap = {
    write: '控制',
    read: '采集'
}

onMounted(() => {
    modalForm.value = props.trigger
    getDataPoint(modalForm.value.id).then((res) => {
        if (modalForm.value.linkage_meta) {
            modalForm.value.linkage_meta['point_name'] = res.data.point_name
        }
    })
})

</script>
<style lang="less">
@import url('@/styles/theme.less');
.view-scene-content {
    display: flex;
    flex-direction: column;
}

.view-scene-item {
    display: flex;
    margin-top: 12px;
    line-height: 1;

    .label {
        display: block;
        width: 100px;
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
