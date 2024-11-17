<template>
    <div class="crevice-test-warp pane-warp">
        <p class="pane-title">测缝监测</p>
        <div class="crevice-test-content">
            <a-table :columns="columns" class="header-table" :bordered="false" :pagination="false" v-if="showTable" />
            <div class="info-scroll-warp">
                <Vue3SeamlessScroll :list="data" class="scroll-table" :limitScrollNum="5" :hover="true">
                    <a-table :columns="columns" :loading="tableToading" v-if="showTable" :showHeader="false" :bordered="false" :dataSource="data" :pagination="false"
                        size="small" :rowKey="(record, i) => i">
                    </a-table>
                </Vue3SeamlessScroll>
            </div>
        </div>
    </div>
</template>
<script setup>
import ControlNormalSvg from '@/assets/svg/control-normal.svg'
import ControlWarnSvg from '@/assets/svg/control-warn.svg'
import ControlAlarmSvg from '@/assets/svg/control-alarm.svg'
import { ref, watch, createVNode, defineProps, onMounted} from 'vue';
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import moment from 'moment'

const props = defineProps({
    message125: {
        type: [Array],
        default: () => []
    },
    scale: {
        type: Number,
        default: 1
    }
})

const handleColumns = () => {
    return [{
            title: '测点名称',
            dataIndex: 'point_name',
            width: 56 * props.scale
        }, {
            title: '采集时间',
            dataIndex: 'created_at',
            customRender: ({record}) => {
                return '今天\n' +  moment(record.created_at).format('HH:mm:ss')
            },
            width: 60 * props.scale
        }, {
            title: '实时状态',
            dataIndex: 'status',
            customRender: ({record}) => {
                const statusObj = {
                0: () => createVNode('img', { src: ControlNormalSvg }),
                1: () => createVNode('img', { src: ControlWarnSvg }),
                }
                return statusObj[record.status] && statusObj[record.status]()
            },
            width: 60 * props.scale
        }, {
            title: '模数(F)',
            dataIndex: 'modulus',
            width: 50 * props.scale,
            customRender: ({record}) => {
                return record.modulus?.toFixed(2) || record.modulus
            }
        }, {
            title: '温度(℃)',
            dataIndex: 'temperature',
            width: 55 * props.scale,
            customRender: ({record}) => {
                return record.temperature?.toFixed(2) || record.temperature
            }
        }, {
            title:  '位移(mm)',
            dataIndex: 'result_value',
            width: 60  * props.scale,
            customRender: ({record}) => {
                return record.result_value?.toFixed(2) || record.result_value
            }
        }]
}

const data = ref([])
const tableToading = ref(false)
// table数据节流渲染
let dataTimer = null
const handleRanderTable = () => {
    if (!dataTimer) {
        dataTimer = setTimeout(() => {
            data.value = props.message125
            tableToading.value = false
            dataTimer = null
        }, 300)
    }
}

watch([() => props.message125], handleRanderTable, {deep: true})


// table大小适配 | 添加节流(因watch执行频繁)
let scaleTimer = null
const columns = ref();
const showTable = ref(false)
const handleResizeTable = () => {
    if (!scaleTimer) {
        showTable.value = false
        scaleTimer = setTimeout(() => {
            columns.value = handleColumns()
            scaleTimer = null
            showTable.value = true
        }, 200)
    }
}
watch([() => props.scale], handleResizeTable)

onMounted(() => {
    handleResizeTable()
    tableToading.value = true
})

</script>
<style lang="less">
.crevice-test-warp {
    height: 2.45rem;
    margin-top: 0.1rem;
    margin-bottom: 0.1rem;
    .pane-title {
        margin-bottom: 0.06rem;
        margin-left: 0 !important;
    }
    .crevice-test-content {
        height: calc(100% - 0.3rem);
    }
    .header-table {
        .ant-table-placeholder {
            display: none;
        }
        th {
            color: #E0E0E0 !important;
            font-size: 0.14rem;
            padding: 0.06rem 0;
            border: none;
            text-align: center;
            background-color: transparent !important;
        }
    }
    .ant-table {
        background: transparent !important;
        .ant-table-body {
            background-color: transparent !important;
        }
    }
    .ant-table-placeholder {
        background: transparent !important;
        padding: 0.1rem;
        border: none;
        .ant-empty-normal {
            margin: 0.24rem 0;
        }
    }

    .info-scroll-warp {
        width: 100%;
        height: 100%;
        overflow: hidden;

        .scroll-table {
            td {
                color: #C5C5C5 !important;
                font-size: 0.12rem;
                padding: 0.04rem 0 !important;
                border: none;
                text-align: center;
                line-height: 1.2;
                background: transparent !important;
            }
        }
    }
}
</style>
