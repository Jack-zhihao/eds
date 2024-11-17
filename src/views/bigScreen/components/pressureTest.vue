<template>
    <div class="pressure-test-warp pane-warp">
        <p class="pane-title">渗压监测</p>
        <div class="crevice-test-content">
            <a-table :columns="columns" class="header-table" :bordered="false" :pagination="false" v-if="showTable" />
            <div class="info-scroll-warp">
                <Vue3SeamlessScroll v-model="isScroll" :list="data" class="scroll-table" :limitScrollNum="7" :hover="true" :step="singleHeight"
                    :singleHeight="singleHeight" :singleWaitTime="3000" v-if="showTable">
                    <a-table :columns="columns" :loading="tableToading" :showHeader="false" :bordered="false"
                        :dataSource="data" :pagination="false" size="small" :rowKey="(record, i) => i" :rowClassName="() => 'scroll-table-row'">
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
import { ref, watch, createVNode, defineProps, onMounted, onUnmounted } from 'vue';
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import moment from 'moment'
const props = defineProps({
    message123: {
        type: Array,
        default: () => []
    },
    message124: {
        type: Array,
        default: () => []
    },
    scale: {
        type: Number,
        default: 1
    }
})

let dataTimer = null
const isScroll = ref(false)
const tableToading = ref(false)
const data = ref()
const handleRanderTable = () => {
    if(!dataTimer) {
        dataTimer = setTimeout(() => {
            data.value = [...props.message123, ...props.message124]
            tableToading.value = false
            dataTimer = null

            // 在数据渲染时需获取一次table滚动行高
            setTimeout(() => {
                const rowDom = document.querySelector('.scroll-table-row')
                singleHeight.value = rowDom.offsetHeight
                isScroll.value = true
            })
        }, 200)
    }
}
watch([() => props.message123, () => props.message123], handleRanderTable, {deep: true})

// 自适应布局
const handleColumns = () => {
    return [{
        title: '测点名称',
        dataIndex: 'point_name',
        width: 56 * props.scale
    }, {
        title: '采集时间',
        dataIndex: 'created_at',
        customRender: ({ record }) => {
            return '今天 ' + moment(record.created_at).format('HH:mm:ss')
        },
        width: 80 * props.scale
    }, {
        title: '实时状态',
        dataIndex: 'status',
        customRender: ({ record }) => {
            const statusObj = {
                0: () => createVNode('img', { src: ControlNormalSvg }),
                1: () => createVNode('img', { src: ControlWarnSvg }),
            }
            return statusObj[record.status] && statusObj[record.status]()
        },
        width: 56 * props.scale
    }, {
        title: '模数(F)',
        dataIndex: 'modulus',
        width: 50 * props.scale,
        customRender({record}) {
            return record.modulus?.toFixed(2) || record.modulus
        }
    }, {
        title: '温度(℃)',
        dataIndex: 'temperature',
        width: 55 * props.scale,
        customRender({record}) {
            return record.temperature?.toFixed(2) || record.temperature
        }
    }, {
        title: '压力(Kpa)',
        dataIndex: 'result_value',
        width: 65 * props.scale,
        customRender: ({ record }) => {
            return record.result_value?.toFixed(2) || record.result_value
        }
    }]
}
let scaleTimer = null
const singleHeight = ref(24)
const showTable = ref(false)
const columns = ref([])
const handleResizeTable = () => {
    if (!scaleTimer) {
        showTable.value = false
        scaleTimer = setTimeout(() => {
            columns.value = handleColumns()
            scaleTimer = null
            showTable.value = true
            // 在数据渲染时需获取一次table滚动行高
            setTimeout(() => {
                const rowDom = document.querySelector('.scroll-table-row')
                if (!rowDom) return
                singleHeight.value = rowDom.offsetHeight
                isScroll.value = true
            })
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
.pressure-test-warp {
    height: calc(100% - 6.45rem);

    .pane-title {
        margin-bottom: 6px;
        margin-left: 0 !important;
    }

    .crevice-test-content {
        height: calc(100% - 0.2rem);
    }

    .header-table {
        .ant-table-placeholder {
            display: none;
        }

        th {
            color: #E0E0E0;
            font-size: 0.1rem;
            padding: 0.06rem 0;
            border: none;
            text-align: center;
            background: transparent;
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
        height: calc(100% - 0.3rem);
        overflow: hidden;

        .scroll-table {
            height: 100%;
            overflow: hidden;
            .scroll-table-row{
                height: 0.24rem;
            }
            td {
                width: 100%;
                color: #C5C5C5;
                font-size: 0.1rem;
                padding: 0.04rem 0 !important;
                border: none;
                text-align: center;
                line-height: 1.2;
                background: transparent !important;
                white-space: nowrap;
                overflow: hidden;
            }
        }
    }
}
</style>
