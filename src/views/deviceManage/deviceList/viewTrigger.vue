<template>
    <a-modal v-model:visible="props.visibleTrigger" :centered="true" :closable="false" :footer="null"
        :bodyStyle="{ width: '800px', height: '500px' }" :width="800" class="common-modal">
        <div class="header">
            <p class="title">触发器列表</p>
            <span class="icon-close" @click="handleBack"></span>
        </div>
        <a-table class="common-table view-trigger-table" :dataSource="dataSource" :columns="columns" :loading="tableToading" :scroll="{y: 350}" :pagination="false"></a-table>
    </a-modal>
</template>
<script setup>
import OnlineTagSvg from '@/assets/svg/online_tag.svg'
import OfflineTagSvg from '@/assets/svg/offline_tag2.svg'
import { defineEmits, defineProps, ref, onMounted, createVNode} from 'vue'
import { getTriggerList } from '@/api/alarmLinkage'
import { Pagination } from 'ant-design-vue'
const props = defineProps({
    visibleTrigger: {
        type: Boolean,
        default: false
    },
    dataPoint: {
        type: Object,
        default: () => { }
    }
})
const emit = defineEmits(['update:visible'])
const handleBack = () => {
    emit('update:visible', false)
}

const enableMap = {
    false: () => createVNode('span', {}, [createVNode('img', {src: OfflineTagSvg}), ' 禁用']),
    true: () => createVNode('span', {}, [createVNode('img', {src: OnlineTagSvg}), ' 启用']),
}
const columns = [
    {
        title: '触发器名称',
        dataIndex: 'trigger_name',
        align: 'center',
    },
    {
        title: '关联数据点',
        dataIndex: 'point_name',
        align: 'center'
    },
    {
        title: '启用状态',
        dataIndex: 'enabled',
        align: 'center',
        customRender: ({record}) => {
            return enableMap[record.enabled]()
        }
    },
    {
        title: '触发条件',
        dataIndex: 'display_condition',
        align: 'center'
    },
    {
        title: '报警状态',
        dataIndex: 'enable_alarm',
        align: 'center',
        customRender: ({record}) => {
            return enableMap[record.enable_alarm]()
        }
    },
    {
        title: '联动状态',
        dataIndex: 'enable_linkage',
        align: 'center',
        customRender: ({record}) => {
            return enableMap[record.enable_linkage]()
        }
    },
]
const dataSource = ref([])
const tableToading = ref(false)
onMounted(() => {
    console.log(props.dataPoint)
    const params = {
        device_id: props.dataPoint.device_id,
        point_name: props.dataPoint.point_name,
        page: '0'
    }
    tableToading.value = true
    getTriggerList(params).then((res) => {
        console.log(res.data)
        dataSource.value = [...res.data]
    }).finally(() => {
        tableToading.value = false
    })
})

</script>
<style lang="less">
.view-trigger-table {
    .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
        padding: 8px 8px;
        border: none;
    }
    .ant-table-fixed-header .ant-table-scroll .ant-table-header {
        margin-right: -16px;
    }
}
</style>
